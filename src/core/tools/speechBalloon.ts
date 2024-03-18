/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect, Group, Path, Polyline } from "spritejs";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { computRect, getRectFromPoints, getWHRatio } from "../utils";
import { transformToSerializableData } from "../../collector/utils";
import { VNodeManager } from "../threadEngine";
import { SpeechBalloonPlacement } from "../../plugin/types";

export interface SpeechBalloonOptions extends BaseShapeOptions {
    thickness: number;
    placement: SpeechBalloonPlacement;
    strokeColor: string;
    fillColor: string;
}
export class SpeechBalloonShape extends BaseShapeTool{
    readonly toolsType: EToolsKey = EToolsKey.SpeechBalloon;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: SpeechBalloonOptions;
    oldRect?: IRectType;
    private syncTimestamp: number;

    constructor(props: BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as SpeechBalloonOptions;
        this.syncTimestamp = 0;
        this.syncUnitTime = 50;
    }
    consume(props: { data: IWorkerMessage; isFullWork?: boolean | undefined; isClearAll?: boolean | undefined; isSubWorker?: boolean | undefined; }): IMainMessage {
        const {data, isFullWork, isSubWorker}= props;
        const workId = data?.workId?.toString();
        if (!workId) {
            return { type: EPostMessageType.None}
        }
        const {op, workState} = data;
        const opl = op?.length;
        if(!opl || opl < 2){
          return { type: EPostMessageType.None}
        }
        let bol:boolean;
        if (workState === EvevtWorkState.Start) {
            this.tmpPoints = [new Point2d(op[0],op[1])];
            bol = false
        } else {
            bol = this.updateTempPoints(op);
        }
        if (!bol) {
            return { type: EPostMessageType.None}
        }
        if (!isSubWorker) {
            const now = Date.now();
            if (now - this.syncTimestamp > this.syncUnitTime) {
                this.syncTimestamp = now;
                return {
                    type: EPostMessageType.DrawWork,
                    dataType: EDataType.Local,
                    workId,
                    op: this.tmpPoints.map(c=>([...c.XY,0])).flat(1),
                    isSync: true,
                    index: 0
                }
            }
            return { type: EPostMessageType.None};
        }
        const r: IRectType | undefined = this.draw({workId, isFullWork, normalize:true, isDrawing:true});
        const rect = computRect(r, this.oldRect);
        this.oldRect = r;
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId,
            // op: this.tmpPoints.map(c=>[...c.XY,0]).flat(1)
        }
    }
    consumeAll(props: { data?: IWorkerMessage | undefined; vNodes: VNodeManager}): IMainMessage {
        const { data }= props;
        const workId = data?.workId?.toString();
        if (!workId) {
            return {type: EPostMessageType.None}
        }
        if (this.tmpPoints.length < 2) {
            return { 
                type: EPostMessageType.RemoveNode,
                removeIds: [workId]
            }
        }
        const rect: IRectType | undefined = this.draw({workId, isFullWork:true, normalize:true, isDrawing:false});
        this.oldRect = rect;
        const op = this.tmpPoints.map(c=>[...c.XY,0]).flat(1);
        const ops = transformToSerializableData(op);
        props.vNodes.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            toolsType: this.toolsType
        })
        return {
            rect,
            type: EPostMessageType.FullWork,
            dataType: EDataType.Local,
            workId,
            ops,
            isSync: true
        }
    }

    private draw(props:{
        workId:string;
        normalize: boolean;
        isFullWork?:boolean;
        isDrawing: boolean;
    }){
        const {workId, normalize, isFullWork, isDrawing} = props;
        this.fullLayer.getElementsByName(workId).map(o=>o.remove());
        this.drawLayer?.getElementsByName(workId).map(o=>o.remove());
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const {strokeColor, fillColor, thickness, zIndex, placement} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        const {rect, pos, points} = this.computDrawPoints(thickness, placement);
        const attr:any = {
            pos,
            close:true,
            name: workId,
            id: workId,
            points,
            lineWidth: thickness,
            fillColor: fillColor, 
            strokeColor,
            normalize,
            zIndex,
            lineJoin: 'round'
        };
        const r: IRectType | undefined = {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0] - BaseShapeTool.SafeBorderPadding * worldScaling[0]),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1] - BaseShapeTool.SafeBorderPadding * worldScaling[1]),
            w: Math.floor(rect.w * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding * worldScaling[0]),
            h: Math.floor(rect.h * worldScaling[1]  + 2 * BaseShapeTool.SafeBorderPadding * worldScaling[1])
        };
        if (isDrawing) {
            const {name, id, zIndex, strokeColor} = attr;
            const centerPos = [
                ((r.x + r.w / 2) - worldPosition[0]) / worldScaling[0],
                ((r.y + r.h / 2) - worldPosition[1]) / worldScaling[1]
            ]
            const group = new Group({
                name, id, zIndex, 
                pos: centerPos,
                anchor: [0.5, 0.5],
                size: [r.w, r.h]
            });
            console.log('attr', attr)
            const node = new Polyline({
                ...attr,
                pos:[0, 0]
            });
            const anchorCross = new Path({
                d:'M-4,0H4M0,-4V4',
                normalize: true,
                pos: [0, 0],
                strokeColor,
                lineWidth: 1,
                scale:[1 / worldScaling[0], 1 / worldScaling[1]]
            });
            group.append(node, anchorCross);
            layer.append(group);
        } else {
            const node = new Polyline(attr);
            layer.append(node);
        }
        return r;
    }
    private computDrawPoints(thickness:number, placement:SpeechBalloonPlacement):{pos: [number,number], rect: IRectType, points:number[]} {
        const r = getRectFromPoints(this.tmpPoints);
        const pos:[number,number] = [Math.floor(r.x + r.w / 2), Math.floor(r.y + r.h / 2)];
        // const scale = getWHRatio(r.w,r.h);
        // const radius = Math.floor(Math.min(r.w,r.h) / 2);
        const points:number[] = [];
        // const average = 2 * Math.PI / vertices;
        // for (let i = 0; i < vertices; i++) {
        //     const outerAngle = i * average - 0.5 * Math.PI;
        //     const x = radius * scale[0] * Math.cos(outerAngle);
        //     const y = radius * scale[1] * Math.sin(outerAngle);
        //     points.push(x, y);
        // }
        const rect = getRectFromPoints(this.tmpPoints, thickness);
        return {
            rect,
            pos,
            points
        };
    }
    private updateTempPoints(op:number[]):boolean{
        const lPoint = op.slice(-2);
        const lastPoint = new Point2d(lPoint[0],lPoint[1]);
        const firstPoint = this.tmpPoints[0];
        const {thickness} = this.workOptions as SpeechBalloonOptions;
        if (firstPoint.isNear(lastPoint, thickness)) {
            return false;
        }
        if (Point2d.Sub(firstPoint, lastPoint).XY.includes(0)) {
            return false;
        }
        if (this.tmpPoints.length === 2) {
            if (lastPoint.isNear(this.tmpPoints[1],1)) {
                return false;
            }
            this.tmpPoints[1] = lastPoint;
        } else {
            this.tmpPoints.push(lastPoint);
        }
        return true;
    }
    consumeService(props: { op: number[]; isFullWork: boolean}): IRectType | undefined {
        const {op, isFullWork} = props;
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        this.tmpPoints.length = 0
        for (let i = 0; i < op.length; i+=3) {
          this.tmpPoints.push(new Point2d(op[i],op[i+1], op[i+2]));
        }
        const rect: IRectType | undefined = this.draw({workId, isFullWork, normalize:true, isDrawing: false});
        this.oldRect = rect;
        return rect
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
}