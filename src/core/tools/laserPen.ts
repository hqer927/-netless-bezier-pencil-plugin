/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layer, Path} from "spritejs";
import { BaseShapeOptions, BaseShapeTool } from "./base";
import { EDataType, EPostMessageType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
// import { Vec2d } from "../utils/primitives/Vec2d";
import { getSvgPathFromPoints } from "../utils/getSvgPathFromPoints";
// import { computRect, getRectFromPoints } from "../utils";
import { EStrokeType } from "../../plugin/types";
import { Point2d } from "../utils/primitives/Point2d";
import { getRectFromPoints } from "../utils";

export interface LaserPenOptions extends BaseShapeOptions {
    thickness: number;
    duration: number;
    strokeType: Omit<EStrokeType,'Stroke'>;
}
export class LaserPenShape extends BaseShapeTool {
    protected syncTimestamp: number;
    private syncIndex:number = 0;
    readonly toolsType: EToolsKey = EToolsKey.LaserPen;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: LaserPenOptions;
    constructor(workOptions: LaserPenOptions, fullLayer: Layer) {
        super(fullLayer);
        this.workOptions = workOptions;
        this.syncTimestamp = 0;
    }
    combineConsume(): undefined {}
    setWorkOptions(setWorkOptions: LaserPenOptions) {
        this.workOptions = setWorkOptions;
        this.syncTimestamp = Date.now();
    }
    consume(data: IWorkerMessage, isUnDraw:boolean): IMainMessage{
        const {workId, op }= data;
        if(op?.length === 0){
          return { type: EPostMessageType.None}
        }
        const lastPointIndex = Math.max(0, this.tmpPoints.length - 1);
        const consumeIndex:number = this.tmpPoints.length;
        this.updateTempPoints(op || []);
        if (consumeIndex === this.tmpPoints.length) {
            return { type: EPostMessageType.None };
        }
        const {color, thickness, strokeType, opacity} = this.workOptions;
        let rect:IRectType|undefined;
        let isSync:boolean = false;
        const index:number = this.syncIndex;
        let points = this.tmpPoints.slice(lastPointIndex);
        const isDot = points.length === 1;
        if (isDot) {
            const dotData = this.computDotStroke({
                point: points[0],
                radius: thickness / 2
            });
            points = dotData.ps;
            rect = dotData.rect;
        } else {
            rect = getRectFromPoints(this.tmpPoints, thickness);
        }
        if (this.syncTimestamp === 0) {
            this.syncTimestamp = Date.now();
        }
        const attrs = {
            name: workId?.toString(),
            className: 'LaserPen',
            fillColor: isDot ? color : undefined,
            opacity: opacity || 1,
            lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
            strokeColor: color,
            lineCap: isDot ? undefined : 'round',
            lineWidth: isDot ? 0 : thickness,
            anchor: [0.5, 0.5],
        }
        // console.log('attrs',attrs, strokeType)
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            const now = Date.now();
            if ( now - this.syncTimestamp > this.syncUnitTime) {
                isSync = true;
                this.syncTimestamp = now;
                this.syncIndex = this.tmpPoints.length;
            }
            !isUnDraw && this.draw({attrs, tasks, isDot});
        }
        const nop:number[] = [];
        this.tmpPoints.slice(index).forEach(p=>{
            nop.push(p.x,p.y)
        })
        return {
          rect,
          type: EPostMessageType.DrawWork,
          dataType: EDataType.Local,
          workId: isSync ? workId : undefined,
          op: isSync ? nop : undefined,
          index: isSync ? index * 2 : undefined
        }
    }
    consumeAll(): IMainMessage {
        const workId = this.workId?.toString();
        const nop:number[] = [];
        this.tmpPoints.slice(this.syncIndex).forEach(p=>{
            nop.push(p.x,p.y)
        })
        return {
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId: workId,
            op: nop,
            index: this.syncIndex * 2
        }
    }
    clearTmpPoints(): void {
        // console.log('animationDraw7')
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
        this.syncIndex = 0;
    }
    consumeService(op: number[]): IRectType | undefined {
        const {color, thickness, strokeType, opacity} = this.workOptions;
        if (!op.length) {
            return getRectFromPoints(this.tmpPoints, thickness);
        }
        const lastPointIndex = Math.max(0, this.tmpPoints.length - 1);
        this.updateTempPoints(op || []);
        let rect:IRectType|undefined;
        let points = this.tmpPoints.slice(lastPointIndex);
        const isDot = points.length === 1;
        if (isDot) {
            const dotData = this.computDotStroke({
                point: points[0],
                radius: thickness / 2
            });
            points = dotData.ps;
            rect = dotData.rect;
        } else {
            rect = getRectFromPoints(this.tmpPoints, thickness);
        }
        const attrs = {
            name: this.workId?.toString(),
            className: 'LaserPen',
            fillColor: isDot ? color : undefined,
            opacity: opacity || 1,
            lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
            strokeColor: color,
            lineCap: isDot ? undefined : 'round',
            lineWidth: isDot ? 0 : thickness,
            anchor: [0.5, 0.5],
        }
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            this.draw({attrs, tasks, isDot});
        }
        return rect
    }
    private computDotStroke(newPoint: {
        point: Point2d,
        radius: number
      }) {
        const {point, radius} = newPoint;
        const rect = {x:point.x-radius, y:point.y-radius, w:radius*2, h:radius*2};
        return {ps:Point2d.GetDotStroke(point, radius, 8), rect};
    }
    private updateTempPoints(globalPoints:number[]) {
        const length = this.tmpPoints.length;
        for (let index = 0; index < globalPoints.length; index += 2) {
            if ( length ) {
                const lastTemPoint = this.tmpPoints.slice(-1)[0];
                if (lastTemPoint && lastTemPoint.x === globalPoints[index] && lastTemPoint.y === globalPoints[index+1]) {
                    this.tmpPoints.pop();
                }
            }
            this.tmpPoints.push(new Point2d(globalPoints[index], globalPoints[index+1]));
        }
    }
    private async draw(data:{
        attrs: Record<string, any>;
        tasks: Array<{ pos: [number, number]; points: Point2d[] }>;
        isDot: boolean;
    }) {
        const {attrs, tasks, isDot } = data;
        const layer = this.fullLayer;
        const {duration} = this.workOptions;
        const node = new Path();
        for (let i=0; i < tasks.length; i++) {
            const {pos, points} = tasks[i];
            let d:string;
            if (isDot) {
                d = getSvgPathFromPoints(points, true);
            } else {
                d = getSvgPathFromPoints(points, false);
            }
            node.attr({
                ...attrs,
                pos,
                d,
            })
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
            layer.appendChild(node);
            await node.transition(duration).attr({
                scale: isDot ? [0.1, 0.1] : [1 , 1],
                lineWidth: isDot ? 0 : 1
            });
            node.remove();
        }
    }
    private getTaskPoints(newPoints: Point2d[]) {
        const tasks:Array<{
          pos:[number,number],
          points:Array<Point2d>
        }> = [];
        if(newPoints.length === 0){
          return []
        }
        let i = 0;
        let sx = newPoints[0].x;
        let sy = newPoints[0].y;
        let pos:[number,number] = [sx, sy];
        let points: Array<Point2d> = [];
        while (i < newPoints.length) {
          const cur = newPoints[i];
          const x = cur.x - sx;
          const y = cur.y - sy;
          points.push(new Point2d(x, y));
          if (i > 0 && i < newPoints.length -1) {
            const angle = newPoints[i].getAngleByPoints(newPoints[i-1],newPoints[i+1]);
            // console.log('angle', angle, newPoints[i].XY, newPoints[i-1].XY, newPoints[i+1])
            if (angle < 90 || angle > 270) {
              const lastPoint = points.pop()?.clone();
              if (lastPoint) {
                tasks.push({
                  pos,
                  points:[...points, lastPoint]
                });
              }
              sx = newPoints[i].x;
              sy = newPoints[i].y;
              pos = [sx, sy];
              const x = cur.x - sx;
              const y = cur.y - sy;
              points = [new Point2d(x, y)];
            }
          }
          i++;
        }
        tasks.push({
          pos,
          points
        });
        return tasks
    }
}