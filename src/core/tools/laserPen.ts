/* eslint-disable @typescript-eslint/no-explicit-any */
import { Path, Node} from "spritejs";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType } from "../types";
// import { Vec2d } from "../utils/primitives/Vec2d";
import { getSvgPathFromPoints } from "../utils/getSvgPathFromPoints";
// import { computRect, getRectFromPoints } from "../utils";
import { EStrokeType } from "../../plugin/types";
import { Point2d } from "../utils/primitives/Point2d";
import { computRect, getRectFromPoints } from "../utils";

export interface LaserPenOptions extends BaseShapeOptions {
    thickness: number;
    duration: number;
    strokeColor:string;
    strokeType: Omit<EStrokeType,'Stroke'>;
}
export class LaserPenShape extends BaseShapeTool {
    readonly toolsType: EToolsKey = EToolsKey.LaserPen;
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.none;
    protected syncTimestamp: number;
    private syncIndex:number = 0;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: LaserPenOptions;
    private consumeIndex:number = 0;
    constructor(props: BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as LaserPenOptions;
        this.syncTimestamp = 0;
    }
    combineConsume(): undefined {}
    setWorkOptions(workOptions: LaserPenOptions) {
        super.setWorkOptions(workOptions);
        this.syncTimestamp = Date.now();
    }
    consume(props:{data: IWorkerMessage, isFullWork:boolean}): IMainMessage{
        const {data, isFullWork} = props;
        const {workId, op }= data;
        if(op?.length === 0){
          return { type: EPostMessageType.None}
        }
        this.updateTempPoints(op || []);
        if (this.consumeIndex > this.tmpPoints.length - 4) {
            return { type: EPostMessageType.None };
        }
        const {strokeColor, thickness, strokeType} = this.workOptions;
        const rect = getRectFromPoints(this.tmpPoints, thickness);
        let isSync:boolean = false;
        const index:number = this.syncIndex;
        const points = this.tmpPoints.slice(this.consumeIndex);
        this.consumeIndex = this.tmpPoints.length - 1;
        if (this.syncTimestamp === 0) {
            this.syncTimestamp = Date.now();
        }
        const attrs = {
            name: workId?.toString(),
            opacity: 1,
            lineDash: strokeType === EStrokeType.Dotted ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted ? [thickness, thickness * 2] : undefined,
            strokeColor,
            lineCap: 'round',
            lineWidth: thickness,
            anchor: [0.5, 0.5],
        }
        //console.log('attrs',attrs, strokeType)
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            const now = Date.now();
            if ( now - this.syncTimestamp > this.syncUnitTime) {
                isSync = true;
                this.syncTimestamp = now;
                this.syncIndex = this.tmpPoints.length;
            }
            !isFullWork && this.draw({attrs, tasks, isDot:false});
        }
        const nop:number[] = [];
        this.tmpPoints.slice(index).forEach(p=>{
            nop.push(p.x,p.y)
        })
        return {
          rect:{
            x:rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
            y:rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
            w:rect.w * this.fullLayer.worldScaling[0],
            h:rect.h * this.fullLayer.worldScaling[1],
          },
          type: EPostMessageType.DrawWork,
          dataType: EDataType.Local,
          workId: isSync ? workId : undefined,
          op: isSync ? nop : undefined,
          index: isSync ? index * 2 : undefined
        }
    }
    consumeAll(): IMainMessage {
        const workId = this.workId?.toString();
        let rect:IRectType|undefined;
        if (this.tmpPoints.length - 1 > this.consumeIndex) {
            let points = this.tmpPoints.slice(this.consumeIndex);
            const isDot = points.length === 1;
            const {strokeColor, thickness, strokeType} = this.workOptions;
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
                name: workId?.toString(),
                fillColor: isDot ? strokeColor : undefined,
                opacity: 1,
                lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
                strokeColor,
                lineCap: isDot ? undefined : 'round',
                lineWidth: isDot ? 0 : thickness,
                anchor: [0.5, 0.5],
            }
            const tasks = this.getTaskPoints(points);
            if (tasks.length) {
                this.draw({attrs, tasks, isDot});
            }
        }
        const nop:number[] = [];
        this.tmpPoints.slice(this.syncIndex).forEach(p=>{
            nop.push(p.x,p.y)
        })
        return {
            rect: rect && {
                x:rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
                y:rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
                w:rect.w * this.fullLayer.worldScaling[0],
                h:rect.h * this.fullLayer.worldScaling[1],
            },
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId: workId,
            op: nop,
            index: this.syncIndex * 2
        }
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
        this.syncTimestamp = 0;
        this.syncIndex = 0;
    }
    consumeService(props:{
        op: number[]
    }): IRectType | undefined {
        const {op} = props;
        const {strokeColor, thickness, strokeType} = this.workOptions;
        if (!op.length) {
            const r = getRectFromPoints(this.tmpPoints, thickness)
            return {
                x:r.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
                y:r.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
                w:r.w * this.fullLayer.worldScaling[0],
                h:r.h * this.fullLayer.worldScaling[1],
            };
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
            fillColor: isDot ? strokeColor : undefined,
            opacity: 1,
            lineDash: strokeType === EStrokeType.Dotted && !isDot ? [1, thickness * 2] : strokeType === EStrokeType.LongDotted && !isDot ? [thickness, thickness * 2] : undefined,
            strokeColor,
            lineCap: isDot ? undefined : 'round',
            lineWidth: isDot ? 0 : thickness,
            anchor: [0.5, 0.5],
        }
        const tasks = this.getTaskPoints(points);
        if (tasks.length) {
            this.draw({attrs, tasks, isDot});
        }
        return {
            x:rect.x * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0],
            y:rect.y * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1],
            w:rect.w * this.fullLayer.worldScaling[0],
            h:rect.h * this.fullLayer.worldScaling[1],
        }
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
            //console.log('angle', angle, newPoints[i].XY, newPoints[i-1].XY, newPoints[i+1])
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
    removeLocal(): undefined {}
    removeService(key:string): IRectType | undefined {
        let rect:IRectType|undefined;
        const removeNode:Node[]=[]
        this.fullLayer.getElementsByName(key).forEach(c=>{
            if (c.name === key) {
                const b = (c as Path).getBoundingClientRect();
                rect = computRect(rect,{
                    x:b.x,
                    y:b.y,
                    w:b.width,
                    h:b.height
                })
                removeNode.push(c);
            }
        })
        if(removeNode.length) {
            removeNode.forEach(r=>r.remove());
        }
        return rect;
    }
}