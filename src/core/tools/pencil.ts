/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layer, Path} from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
import { Vec2d } from "../utils/primitives/Vec2d";
import { getSvgPathFromPoints } from "../utils/getSvgPathFromPoints";
import { transformToSerializableData } from "../../collector/utils";
import { computRect, getRectFromPoints } from "../utils";
import { EStrokeType } from "../../plugin/types";

export interface PencilOptions extends BaseShapeOptions {
    thickness: number;
    strokeType: EStrokeType;
}
export class PencilShape extends BaseShapeTool {
    readonly toolsType: EToolsKey = EToolsKey.Pencil;
    protected syncTimestamp: number;
    private syncIndex:number = 0;
    protected tmpPoints:Array<Point2d> = [];
    private MAX_REPEAR = 10;
    /** 合并原始点的灵敏度 */
    private uniThickness: number;
    protected workOptions: PencilOptions;
    constructor(workOptions: PencilOptions, fullLayer: Layer, drawlayer?: Layer) {
        super(fullLayer, drawlayer);
        this.workOptions = workOptions;
        this.uniThickness = this.MAX_REPEAR / workOptions.thickness / 10;
        this.syncTimestamp = 0;
    }
    combineConsume(): IMainMessage | undefined {
      const workId = this.workId?.toString();
      const tasks = this.transformDataAll();
      const attrs = {
        name: workId,
        className: 'pencil'
      }
      let rect:IRectType|undefined;
      if (tasks.length) {
        rect = this.draw({attrs, tasks, replaceId: workId, isFullWork:false});
      }
      return {
        rect,
        type: EPostMessageType.DrawWork,
        dataType: EDataType.Local
      }
    }
    setWorkOptions(workOptions: PencilOptions) {
        super.setWorkOptions(workOptions);
        this.syncTimestamp = Date.now();
    }
    consume(data: IWorkerMessage, isFullWork?:boolean): IMainMessage{
        if(data.op?.length === 0){
          return { type: EPostMessageType.None}
        }
        const {workId}= data; 
        const {tasks, effects, consumeIndex} = this.transformData(data,false);
        this.syncIndex = Math.min(this.syncIndex, consumeIndex);
        const attrs = {
            name: workId?.toString(),
            className: 'pencil'
        }
        let rect:IRectType|undefined;
        let isSync:boolean = false;
        const index:number = this.syncIndex;
        if (this.syncTimestamp === 0) {
          this.syncTimestamp = Date.now();
        }
        // console.log('tmpPoints', effects, this.tmpPoints.map(p=>({p:p.toArray(),t:p.t})))
        if (tasks.length) {
          if (tasks[0].taskId - this.syncTimestamp > this.syncUnitTime) {
            isSync = true;
            this.syncTimestamp = tasks[0].taskId;
            this.syncIndex = this.tmpPoints.length;
          }
          rect = this.draw({attrs, tasks, effects, isFullWork});
        }
        const op:number[] = [];
        this.tmpPoints.slice(index).forEach(p=>{
          op.push(p.x,p.y,p.z)
        })
        return {
          rect,
          type: EPostMessageType.DrawWork,
          dataType: EDataType.Local,
          workId: isSync ? workId : undefined,
          op: isSync ? op : undefined,
          index: isSync ? index * 3 : undefined
        }
    }
    consumeAll(data?: IWorkerMessage): IMainMessage {
        if(data){
          const {op, workState} = data;
          if (op?.length && workState === EvevtWorkState.Done) {
            if (this.workOptions.strokeType === EStrokeType.Stroke) {
              this.updateTempPointsWithPressureWhenDone(op);
            }
          }
        }
        const workId = this.workId?.toString();
        const tasks = this.transformDataAll();
        const attrs = {
          name: workId,
          className: 'pencil'
        }
        let rect:IRectType|undefined;
        if (tasks.length) {
          rect = this.draw({attrs, tasks, replaceId: workId, isFullWork:true});
        }
        const nop:number[] = [];
        this.tmpPoints.map(p=>{
          nop.push(p.x,p.y,p.z)
        })
        this.syncTimestamp = 0;
        // console.log('drawAll', rect)
        return {
          rect,
          type: EPostMessageType.FullWork,
          dataType: EDataType.Local,
          workId,
          ops: transformToSerializableData(nop)
        }
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
        this.syncIndex = 0;
    }
    consumeService(op: number[], isFullWork?:boolean): IRectType | undefined {
      this.tmpPoints.length = 0
      for (let i = 0; i < op.length; i+=3) {
        const point = new Point2d(op[i],op[i+1],op[i+2]);
        if (this.tmpPoints.length > 0) {
          const lastTmpPoint = this.tmpPoints[this.tmpPoints.length-1];
          const vector = Vec2d.Sub(point, lastTmpPoint).uni();
          // lastTmpPoint.setv(vector);
          point.setv(vector);
        }
        this.tmpPoints.push(point);
      }
      const tasks = this.transformDataAll();
      const attrs = {
        name: this.workId?.toString(),
        className: 'pencil'
      }
      let rect:IRectType|undefined;
      if (tasks.length) {
          rect = this.draw({attrs, tasks, replaceId: isFullWork? this.workId : undefined, isFullWork});
      }
      return rect
    }
    private transformDataAll() {
        return this.getTaskPoints(this.tmpPoints, this.workOptions.thickness);
    }
    private draw(data:{
        attrs: Record<string, any>;
        tasks: Array<{
          taskId: number;
          pos:[number,number];
          points: {
            point: Point2d;
            radius: number;
          }[]
        }>;
        isFullWork?:boolean;
        replaceId?: number|string;
        effects?: Set<number>;
      }): IRectType | undefined {
        const {attrs, tasks, replaceId, effects, isFullWork} = data;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const {color, strokeType, thickness, opacity} = this.workOptions;
        // console.log('draw', isFullWork)
        if (!isFullWork) {
          layer.removeAllChildren();
        } else {
          if (replaceId) {
            layer.getElementsByName(replaceId+'').map(o=>o.remove());
          }
          if (effects?.size) {
              effects.forEach(id=>{
                const n = layer.getElementById(id+'');
                n?.remove()
              })
              effects.clear();
          }
        }
        let r:IRectType|undefined;
        for (let i=0; i < tasks.length; i++) {
            const {pos, points, taskId} = tasks[i];
            attrs.id = taskId.toString();
            const node = new Path();
            const {ps, rect} = this.computDrawPoints(points);
            let d:string;
            const isDot:boolean = points.length === 1;
            if (strokeType === EStrokeType.Stroke || isDot) {
              d = getSvgPathFromPoints(ps,true);
            } else {
              d = getSvgPathFromPoints(ps, false);
            }
            node.attr({
              ...attrs,
              pos,
              d,
              fillColor: strokeType === EStrokeType.Stroke || isDot ? color : undefined, 
              opacity: opacity || 1,
              lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
              strokeColor: color,
              lineCap: strokeType === EStrokeType.Stroke || isDot ? undefined : 'round',
              lineWidth: strokeType === EStrokeType.Stroke || isDot ? 0 : thickness,
            });
            r = computRect(r, {
              x: Math.floor(rect.x + pos[0] - 10),
              y: Math.floor(rect.y + pos[1] - 10),
              w: Math.floor(rect.w + 20),
              h: Math.floor(rect.h + 20)
            });
            const {vertex, fragment} = this.workOptions;
            if (vertex && fragment) {
                const program = layer.renderer.createProgram({vertex, fragment});
                const {width, height} = layer.getResolution();
                node.setUniforms({
                u_time: 0,
                u_resolution: [width, height],
                });
                node.setProgram(program);
            }
            if(!isFullWork && this.drawLayer){
              Promise.resolve().then(() => {
                this.fullLayer.appendChild(node.cloneNode());
              });
            }
            layer.appendChild(node);
        }
        return r;
    }
    private computDrawPoints(points:Array<{
      point: Point2d,
      radius: number
    }>){
      const strokeType = this.workOptions.strokeType;
      if (strokeType === EStrokeType.Stroke || points.length === 1) {
        return this.computStroke(points);
      }
      return this.computNomal(points);
    }
    private computNomal(points:Array<{
        point: Point2d,
        radius: number
    }>){
      const ps = points.map(p=>p.point);
      return {ps, rect:getRectFromPoints(ps, this.workOptions.thickness)}
    }
    private computStroke(points:Array<{
        point: Point2d,
        radius: number
      }>) {
        const length = points.length;
        if (length === 1) {
          return this.computDotStroke(points[0])
          // return Bezier.bezier(10,this.computDotStroke(points[0]));
        }
        return this.computLineStroke(points)
        // return Bezier.bezier(10,this.computLineStroke(points)) 
    }
    private computLineStroke(strokes: Array<{
        point: Point2d,
        radius: number
      }>) {
        const leftPts:Point2d[] = [];
        const rightPts:Point2d[] = [];
        for (let index = 0; index < strokes.length; index++) {
          const {point,radius} = strokes[index]; 
          let vector = point.v;
          if (index === 0 && strokes.length > 1) {
            vector = strokes[index + 1].point.v;
          }
          const offset = Vec2d.Per(vector).mul(radius);
          leftPts.push(Point2d.Sub(point, offset))
          rightPts.push(Point2d.Add(point, offset))
        }
        const lastPoint = strokes[strokes.length - 1];
        const endCap: Point2d[] = Point2d.GetSemicircleStroke(lastPoint.point, leftPts[leftPts.length-1],-1, 8);
        const startCap: Point2d[] = Point2d.GetSemicircleStroke(strokes[0].point, rightPts[0],-1, 8);
        const ps = leftPts.concat(endCap,rightPts.reverse(), startCap);
        return {ps, rect:getRectFromPoints(ps)}
    }
    private computDotStroke(newPoint: {
        point: Point2d,
        radius: number
      }) {
        const {point, radius} = newPoint;
        const rect = {x:point.x-radius, y:point.y-radius, w:radius*2, h:radius*2};
        return {ps:Point2d.GetDotStroke(point, radius, 8), rect};
    }
    private transformData(data:IWorkerMessage, isFullWork?:boolean){
        const {op, workState} = data;
        let consumeIndex = this.tmpPoints.length - 1;
        let tasks:{
            taskId: number;
            pos: [number, number];
            points: Array<{
                point: Point2d;
                radius: number;
            }>;
        }[] = [];
        if (op?.length && workState) {
            const {strokeType, thickness} = this.workOptions as PencilOptions;
            const effects: Set<number> = new Set();
            consumeIndex = strokeType === EStrokeType.Stroke ? this.updateTempPointsWithPressure(op, thickness, effects) : this.updateTempPoints(op, thickness, effects);
            const points = isFullWork ? this.tmpPoints : this.tmpPoints.slice(consumeIndex);
            tasks = this.getTaskPoints(points, thickness);
            return {tasks, effects, consumeIndex}
        }
        return { tasks, consumeIndex }
    }
    private computRadius(z:number, thickness:number){
        return z *  0.3 + thickness * 0.5;
    }
    private getTaskPoints(newPoints: Point2d[], thickness:number) {
        const tasks:Array<{
          taskId: number;
          pos:[number,number],
          points:Array<{
            point: Point2d,
            radius: number
          }>
        }> = [];
        if(newPoints.length === 0){
          return []
        }
        let i = 0;
        let sx = newPoints[0].x;
        let sy = newPoints[0].y;
        let pos:[number,number] = [sx, sy];
        let points: Array<{
          point: Point2d,
          radius: number
        }> = [];
        let taskId:number = newPoints[0].t;
        while (i < newPoints.length) {
          const cur =  newPoints[i];
          const x = cur.x - sx;
          const y = cur.y - sy;
          const z = cur.z;
          const radius = this.computRadius(z,thickness);
          points.push({
            point: new Point2d(x, y, z, newPoints[i].v),
            radius
          });
          if (i > 0 && i < newPoints.length -1) {
            const angle = newPoints[i].getAngleByPoints(newPoints[i-1],newPoints[i+1]);
            // console.log('angle', angle, newPoints[i].XY, newPoints[i-1].XY, newPoints[i+1])
            if (angle < 90 || angle > 270) {
              const lastPoint = points.pop()?.point.clone();
              if (lastPoint) {
                tasks.push({
                  taskId,
                  pos,
                  points:[...points, {
                    point:lastPoint,
                    radius
                  }]
                });
              }
              sx = newPoints[i].x;
              sy = newPoints[i].y;
              pos = [sx, sy];
              const x = cur.x - sx;
              const y = cur.y - sy;
              points = [{
                point: new Point2d(x, y, z),
                radius
              }];
              taskId = Date.now();
            }
          }
          i++;
        }
        tasks.push({
          taskId,
          pos,
          points
        });
        // console.log('aaaa11', newPoints, tasks)
        return tasks
    }
    private updateTempPointsWithPressure(globalPoints:number[], thickness: number, effects?:Set<number>) {
        const taskId = Date.now();
        const oldLength = this.tmpPoints.length;
        let willChangeMinIndex = oldLength;
        for (let index = 0; index < globalPoints.length; index += 2) {
          willChangeMinIndex = Math.min(willChangeMinIndex, oldLength);
          const length = this.tmpPoints.length
          const nextPoint = new Point2d(globalPoints[index], globalPoints[index+1]);
          if (length === 0) {
            this.tmpPoints.push(nextPoint);
            continue;
          }
          const lastIndex = length-1;
          const lastTemPoint = this.tmpPoints[lastIndex];
          const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
          // 合并附近点,不需要nextPoint
          if (nextPoint.isNear(lastTemPoint, thickness)) {
            if (lastTemPoint.z < this.MAX_REPEAR) {
              lastTemPoint.setz(Math.min(lastTemPoint.z + 1, this.MAX_REPEAR));
              willChangeMinIndex = Math.min(willChangeMinIndex, lastIndex);
              if (length > 1) {
                let i = length - 1
                while (i > 0) {
                  const distance = this.tmpPoints[i].distance(this.tmpPoints[i-1]);
                  const preZ = Math.max(this.tmpPoints[i]. z - this.uniThickness * distance, 0);
                  if (this.tmpPoints[i-1].z >= preZ) {
                    i == 0;
                    break;
                  }
                  this.tmpPoints[i-1].setz(preZ);
                  willChangeMinIndex = Math.min(willChangeMinIndex, i-1)
                  // console.log('addEffect2',willChangeMinIndex)
                  i--;
                }
              }
            } else {
              willChangeMinIndex = Infinity;
            }
            continue;
          }
          nextPoint.setv(vector);
          const distance = nextPoint.distance(lastTemPoint);
          const z = Math.max(lastTemPoint. z - this.uniThickness * distance, 0);
          // 向量一致的点，在z可线性变化下移除
          if (length > 1  && Vec2d.Equals(vector, lastTemPoint.v, 0.02) && (z > 0 || lastTemPoint.z <=0)) {
            if (effects && lastTemPoint.t) {
              effects.add(lastTemPoint.t);
            }
            this.tmpPoints.pop();
            willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
          }
          nextPoint.setz(z);
          this.tmpPoints.push(nextPoint);
        }
        // 无效的点，原始点未有变化
        if(willChangeMinIndex === Infinity){
          return this.tmpPoints.length
        }
        let consumeIndex = oldLength;
        // 增量无副作用，那最后一个点做为消费下标
        if (willChangeMinIndex === oldLength) {
          consumeIndex = Math.max(consumeIndex - 1, 0);
          // console.log('consumeInde1x', consumeIndex, this.tmpPoints[consumeIndex])
          const t = this.tmpPoints[consumeIndex].t;
          if (t) {
            effects?.add(t);
          }
        } 
        // 需要找到最近的taskId的下标作为消费下标
        else {
          let i = oldLength - 1;
          consumeIndex = willChangeMinIndex;
          while (i >= 0) {
            // console.log('consumeIndex', i, this.tmpPoints[i])
            const t = this.tmpPoints[i].t;
            if (t) {
              effects?.add(t);
              if (i <= willChangeMinIndex) {
                consumeIndex = i;
                i = -1
                break;
              }
            }
            i--;
          }
        }
        this.tmpPoints[consumeIndex].setT(taskId);
        // console.log('tmpPoints', consumeIndex, this.tmpPoints.map(t=>(t.toArray())))
        return consumeIndex;
    }
    private updateTempPoints(globalPoints:number[], thickness:number, effects?:Set<number>) {
      const taskId = Date.now();  
      const oldLength = this.tmpPoints.length;
      let willChangeMinIndex = oldLength;
      for (let index = 0; index < globalPoints.length; index += 2) {
          const length = this.tmpPoints.length
          const nextPoint = new Point2d(globalPoints[index], globalPoints[index+1] );
          if (length === 0) {
              this.tmpPoints.push(nextPoint);
              continue;
          }
          const lastIndex = length-1;
          const lastTemPoint = this.tmpPoints[lastIndex];
          const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
          // 向量一致的点，在z可线性变化下移除
          if (Vec2d.Equals(vector, lastTemPoint.v, 0.02)) {
              if (effects && lastTemPoint.t) {
                effects.add(lastTemPoint.t);
              }
              this.tmpPoints.pop();
              willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
              continue;
          }
          if(nextPoint.isNear(lastTemPoint, thickness / 2)){
              willChangeMinIndex = Math.min(lastIndex, willChangeMinIndex);
              continue;
          }
          nextPoint.setv(vector);
          this.tmpPoints.push(nextPoint);
      }
      let consumeIndex = oldLength;
      // 增量无副作用，那最后一个点做为消费下标
      if (willChangeMinIndex === oldLength) {
        consumeIndex = Math.max(consumeIndex - 1, 0);
        // console.log('consumeInde1x', consumeIndex, this.tmpPoints[consumeIndex])
        const t = this.tmpPoints[consumeIndex].t;
        if (t) {
          effects?.add(t);
        }
      } 
      // 需要找到最近的taskId的下标作为消费下标
      else {
        let i = Math.min(oldLength - 1, willChangeMinIndex);
        consumeIndex = willChangeMinIndex;
        // console.log('consumeIndex', oldLength, willChangeMinIndex, this.tmpPoints.length)
        while (i >= 0) {
          const t = this.tmpPoints[i]?.t;
          // console.log('consumeIndex1', i, this.tmpPoints[i], t)
          if (t) {
            effects?.add(t);
            if (i <= willChangeMinIndex) {
              consumeIndex = i;
              i = -1
              break;
            }
          }
          i--;
        }
      }
      this.tmpPoints[consumeIndex].setT(taskId);
      return consumeIndex;
    }
    private updateTempPointsWithPressureWhenDone(globalPoints:number[]) {
      const {thickness} = this.workOptions;
      // console.log('tmpPoints', globalPoints, this.tmpPoints.map(p=>p.toArray()))
      for (let index = 0; index < globalPoints.length; index += 2) {
        const length = this.tmpPoints.length
        const nextPoint = new Point2d(globalPoints[index], globalPoints[index+1]);
        if (length === 0) {
          this.tmpPoints.push(nextPoint);
          continue;
        }
        const lastIndex = length-1;
        const lastTemPoint = this.tmpPoints[lastIndex];
        const vector = Vec2d.Sub(nextPoint, lastTemPoint).uni();
        // 合并附近点,不需要nextPoint
        if (nextPoint.isNear(lastTemPoint, thickness / 2)) {
          if (lastTemPoint.z < this.MAX_REPEAR) {
            lastTemPoint.setz(Math.min(lastTemPoint.z + 1, this.MAX_REPEAR));
            if (length > 1) {
              let i = length - 1
              while (i > 0) {
                const distance = this.tmpPoints[i].distance(this.tmpPoints[i-1]);
                const preZ = Math.max(this.tmpPoints[i]. z - this.uniThickness * distance, 0);
                if (this.tmpPoints[i-1].z >= preZ) {
                  i == 0;
                  break;
                }
                this.tmpPoints[i-1].setz(preZ);
                i--;
              }
            }
          }
          continue;
        }
        nextPoint.setv(vector);
        const distance = nextPoint.distance(lastTemPoint);
        const z = Math.max(lastTemPoint. z - this.uniThickness * distance,  - this.MAX_REPEAR / 5);
        // 向量一致的点，在z可线性变化下移除
        if (length > 1  && Vec2d.Equals(vector, lastTemPoint.v, 0.02) && lastTemPoint.z <=0 ) {
          this.tmpPoints.pop();
        }
        nextPoint.setz(z);
        this.tmpPoints.push(nextPoint);
      }
      // console.log('tmpPoints1', globalPoints, this.tmpPoints.map(p=>p.toArray()))
    }
}