/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Polyline } from "spritejs";
import { IWorkerMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { computRect, getRectFromPoints } from "../utils";
import { Vec2d } from "../utils/primitives/Vec2d";
import { transformToSerializableData } from "../../collector/utils";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";

export interface ArrowOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor:string;
}
export class ArrowShape extends BaseShapeTool{
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.both;
    readonly toolsType: EToolsKey = EToolsKey.Arrow;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: ArrowOptions;
    oldRect?: IRectType;
    private arrowTipWidth:number;
    private syncTimestamp: number;
    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as ArrowOptions;
        this.arrowTipWidth = this.workOptions.thickness * 4;
        this.syncTimestamp = 0;
        this.syncUnitTime = 50;
    }
    consume(props: { 
        data: IWorkerMessage; 
        isFullWork?: boolean; 
        isSubWorker?: boolean; 
        isMainThread?: boolean;
    }) {
        const {data, isFullWork, isSubWorker, isMainThread}= props;
        const workId = this.workId;
        const {op} = data;
        const opl = op?.length;
        if(!opl || opl < 2){
          return { type: EPostMessageType.None }
        }
        let bol:boolean;
        if (this.tmpPoints.length === 0) {
            this.tmpPoints = [new Point2d(op[0],op[1])];
            bol = false
        } else {
            bol = this.updateTempPoints(op);
        }
        if (!bol) {
            return { type:EPostMessageType.None}
        }
        let r: IRectType | undefined;
        if (isSubWorker || isMainThread) {
            const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
            r = this.draw({workId, layer});
        }
        if (!isSubWorker) {
            const now = Date.now();
            if (now - this.syncTimestamp > this.syncUnitTime) {
                this.syncTimestamp = now;
                return {
                    ...this.baseConsumeResult,
                    type: EPostMessageType.DrawWork,
                    dataType: EDataType.Local,
                    op: this.tmpPoints.map(c=>([...c.XY,0])).flat(1),
                    isSync: true,
                    index: 0
                }
            }
            return { type: EPostMessageType.None};
        }
        const rect = computRect(r, this.oldRect);
        this.oldRect = r;
        return {
            rect, ...this.baseConsumeResult,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,

        }
    }
    consumeAll() {
        const workId = this.workId;
        if (this.tmpPoints.length < 2) {
            return {
                type: EPostMessageType.RemoveNode,
                removeIds: [workId]
            }
        }
        const layer = this.fullLayer;
        const rect: IRectType | undefined = this.draw({workId, layer});
        this.oldRect = rect;
        const op = this.tmpPoints.map(c=>[...c.XY,0]).flat(1);
        const ops = transformToSerializableData(op);
        this.vNodes?.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            canRotate: this.canRotate,
            scaleType: this.scaleType,
            centerPos: BaseShapeTool.getCenterPos(rect, layer)
        })
        return {
            rect, ...this.baseConsumeResult,
            type: EPostMessageType.FullWork,
            dataType: EDataType.Local,
            ops,
            isSync: true,
        }
    }
    private draw(props:{
        workId:string;
        layer:Group;
    }){
        const {workId, layer} = props;
        const {strokeColor, thickness, zIndex, scale, rotate, translate} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        const {points, rect} = this.computDrawPoints(thickness);
        const centerPos = [
            rect.x + rect.w / 2,
            rect.y + rect.h / 2
        ]
        const attr:any = {
            pos: centerPos,
            name: workId,
            id: workId,
            close: true,
            points,
            fillColor: strokeColor, 
            strokeColor,
            lineWidth: 0,
            normalize: true,
            zIndex,
        };
        if (scale) {
            attr.scale = scale;
        }
        if (rotate) {
            attr.rotate = rotate;
        }
        if (translate) {
            attr.translate = translate;
        }
        const node = new Polyline(attr);
        this.replace(layer,workId, node)
        if (scale || rotate || translate) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
            }
        }
        return {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0] - BaseShapeTool.SafeBorderPadding),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1] - BaseShapeTool.SafeBorderPadding),
            w: Math.floor(rect.w * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding),
            h: Math.floor(rect.h * worldScaling[1]  + 2 * BaseShapeTool.SafeBorderPadding)
        };
    }
    private computDrawPoints(thickness:number):{points:number[], pos: [number,number], rect: IRectType, isTriangle?: boolean} {
        const distance = this.tmpPoints[1].distance(this.tmpPoints[0]);
        if (distance > this.arrowTipWidth) {
            return this.computFullArrowPoints(thickness);
        } else {
            return this.computTrianglePoints();
        }
    }
    private computFullArrowPoints(thickness:number) {
        const vector = Vec2d.Sub(this.tmpPoints[1], this.tmpPoints[0]).uni();
        const lineSegmentOffset = Vec2d.Per(vector).mul(thickness / 2);
        const lineSegmentStartLeft = Point2d.Sub(this.tmpPoints[0], lineSegmentOffset);
        const lineSegmentStartRight = Point2d.Add(this.tmpPoints[0], lineSegmentOffset);
        const lineSegmentEndOffset = Vec2d.Mul(vector, this.arrowTipWidth);
        const lineSegmentEnd = Vec2d.Sub(this.tmpPoints[1], lineSegmentEndOffset);
        const lineSegmentEndLeft = Point2d.Sub(lineSegmentEnd, lineSegmentOffset);
        const lineSegmentEndRight = Point2d.Add(lineSegmentEnd, lineSegmentOffset);
        const triangleSideOffset = Vec2d.Per(vector).mul(thickness * 1.5 );
        const triangleSideLeft = Point2d.Sub(lineSegmentEnd, triangleSideOffset);
        const triangleSideRight = Point2d.Add(lineSegmentEnd, triangleSideOffset);
        const ps:Point2d[] = [lineSegmentStartLeft, lineSegmentEndLeft, triangleSideLeft, this.tmpPoints[1],
            triangleSideRight, lineSegmentEndRight, lineSegmentStartRight];
        return {
            points: ps.map(p=>Point2d.Sub(p, this.tmpPoints[0]).XY).flat(1),
            rect: getRectFromPoints(ps),
            isTriangle: false,
            pos: this.tmpPoints[0].XY
        }
    }
    private computTrianglePoints(){
        const vector = Vec2d.Sub(this.tmpPoints[1], this.tmpPoints[0]).uni();
        const distance = this.tmpPoints[1].distance(this.tmpPoints[0]);
        const triangleSideOffset = Vec2d.Per(vector).mul(Math.floor(distance * 3 / 8));
        const triangleSideLeft = Point2d.Sub(this.tmpPoints[0], triangleSideOffset);
        const triangleSideRight = Point2d.Add(this.tmpPoints[0], triangleSideOffset);
        const ps:Point2d[] = [triangleSideLeft, this.tmpPoints[1], triangleSideRight];
        return {
            points: ps.map(p=>Point2d.Sub(p, this.tmpPoints[0]).XY).flat(1),
            rect: getRectFromPoints(ps),
            isTriangle: true,
            pos: this.tmpPoints[0].XY
        }
    }
    private updateTempPoints(op:number[]):boolean{
        const lPoint = op.slice(-2);
        const lastPoint = new Point2d(lPoint[0],lPoint[1]);
        const firstPoint = this.tmpPoints[0];
        const {thickness} = this.workOptions as ArrowOptions;
        if (firstPoint.isNear(lastPoint, thickness)) {
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
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect: IRectType | undefined = this.draw({workId, layer});
        this.oldRect = rect;
        this.vNodes?.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            canRotate: this.canRotate,
            scaleType: this.scaleType,
            centerPos: BaseShapeTool.getCenterPos(rect, layer)
        })
        return rect
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
    static updateNodeOpt(param:{
        node: ShapeNodes,
        opt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        willSerializeData?: boolean,
    }) {
        const {node, opt, vNodes} = param;
        const {strokeColor} = opt;
        const nodeOpt = vNodes.get(node.name);
        if (strokeColor) {
            node.setAttribute('strokeColor', strokeColor);
            node.setAttribute('fillColor', strokeColor);
            if (nodeOpt?.opt?.strokeColor ) {
                nodeOpt.opt.strokeColor = strokeColor;
            }
            nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        }
        return BaseShapeTool.updateNodeOpt(param);
    }
}