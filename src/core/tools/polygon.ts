/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Path, Polyline } from "spritejs";
import { IWorkerMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { computRect, getRectFromPoints, getWHRatio } from "../utils";
import { transformToSerializableData } from "../../collector/utils";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";

export interface PolygonOptions extends BaseShapeOptions {
    thickness: number;
    vertices: number;
    strokeColor:string;
    fillColor: string;
}
export class PolygonShape extends BaseShapeTool{
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.all;
    readonly toolsType: EToolsKey = EToolsKey.Polygon;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: PolygonOptions;
    oldRect?: IRectType;
    private syncTimestamp: number;

    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as PolygonOptions;
        this.syncTimestamp = 0;
        this.syncUnitTime = 50;
    }
    consume(props: { 
        data: IWorkerMessage; 
        isFullWork?: boolean; 
        isClearAll?: boolean;
        isSubWorker?: boolean; 
        isMainThread?: boolean;
    }) {
        const {data, isFullWork, isSubWorker, isMainThread}= props;
        const {op} = data;
        const workId = this.workId;
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
            return { type: EPostMessageType.None }
        }
        let r: IRectType | undefined;
        if (isSubWorker || isMainThread) {
            const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
            r = this.draw({workId, layer, isDrawing:true});
        }
        if (!isSubWorker) {
            const now = Date.now();
            if (now - this.syncTimestamp > this.syncUnitTime) {
                this.syncTimestamp = now;
                return {
                    type: EPostMessageType.DrawWork,
                    dataType: EDataType.Local,
                    op: this.tmpPoints.map(c=>([...c.XY,0])).flat(1),
                    isSync: true,
                    index: 0,
                    ...this.baseConsumeResult
                }
            }
            return { type: EPostMessageType.None };
        }
        const rect = computRect(r, this.oldRect);
        this.oldRect = r;
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            ...this.baseConsumeResult
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
        const rect: IRectType | undefined = this.draw({workId, layer, isDrawing:false});
        this.oldRect = rect;
        const op = this.tmpPoints.map(c=>[...c.XY,0]).flat(1);
        const ops = transformToSerializableData(op);
        this.vNodes?.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
        })
        return {
            rect,
            type: EPostMessageType.FullWork,
            dataType: EDataType.Local,
            ops,
            isSync: true,
            ...this.baseConsumeResult
        }
    }

    private draw(props:{
        workId:string;
        layer:Group;
        isDrawing: boolean;
    }){
        const {workId, layer, isDrawing} = props;
        const {strokeColor, fillColor, thickness, zIndex, vertices, scale, rotate, translate} = this.workOptions;
        const worldScaling = layer.worldScaling;
        const {rect, pos, points} = this.computDrawPoints(thickness, vertices);
        const attr:any = {
            close:true,
            points,
            lineWidth: thickness,
            fillColor: fillColor !== 'transparent' && fillColor || undefined, 
            strokeColor,
            normalize: true,
            lineJoin: 'round'
        };
        const groupAttr:any = {
            name: workId,
            id: workId,
            zIndex,
            pos,
            anchor: [0.5, 0.5],
            size: [rect.w, rect.h],
        };
        if (scale) {
            groupAttr.scale = scale;
        }
        if (rotate) {
            groupAttr.rotate = rotate;
        }
        if (translate) {
            groupAttr.translate = translate;
        }
        const group = new Group(groupAttr);
        if (isDrawing) {
            const anchorCross = new Path({
                d:'M-4,0H4M0,-4V4',
                normalize: true,
                pos: [0, 0],
                strokeColor,
                lineWidth: 1,
                scale:[1 / worldScaling[0], 1 / worldScaling[1]]
            });
            group.append(anchorCross);
        }
        const node = new Polyline({
            ...attr,
            pos:[0, 0]
        });
        group.append(node);
        this.replace(layer, workId, group);
        const _r = group.getBoundingClientRect();
        return {
            x: Math.floor(_r.x - BaseShapeTool.SafeBorderPadding),
            y: Math.floor(_r.y - BaseShapeTool.SafeBorderPadding),
            w: Math.floor(_r.width + BaseShapeTool.SafeBorderPadding * 2),
            h: Math.floor(_r.height + BaseShapeTool.SafeBorderPadding * 2)
        }
    }
    private computDrawPoints(thickness:number, vertices:number):{pos: [number,number], rect: IRectType, points:number[]} {
        const r = getRectFromPoints(this.tmpPoints);
        const pos:[number,number] = [Math.floor(r.x + r.w / 2), Math.floor(r.y + r.h / 2)];
        const scale = getWHRatio(r.w,r.h);
        const radius = Math.floor(Math.min(r.w,r.h) / 2);
        const points:number[] = [];
        const average = 2 * Math.PI / vertices;
        for (let i = 0; i < vertices; i++) {
            const outerAngle = i * average - 0.5 * Math.PI;
            const x = radius * scale[0] * Math.cos(outerAngle);
            const y = radius * scale[1] * Math.sin(outerAngle);
            points.push(x, y);
        }
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
        const {thickness} = this.workOptions as PolygonOptions;
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
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect: IRectType | undefined = this.draw({workId, layer, isDrawing: false});
        this.oldRect = rect;
        this.vNodes?.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
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
    }){
        const {node, opt, vNodes} = param;
        const {strokeColor, fillColor, toolsType, vertices} = opt;
        const nodeOpt = vNodes.get(node.name);
        const _Opt = nodeOpt?.opt as PolygonOptions;
        let n = node;
        if (node.tagName === 'GROUP') {
            n = (node as Group).children[0]
        }
        if (strokeColor) {
            n.setAttribute('strokeColor', strokeColor);
            if (_Opt?.strokeColor ) {
                _Opt.strokeColor = strokeColor;
            }
        }
        if (fillColor) {
            if (fillColor === 'transparent') {
                n.setAttribute('fillColor', 'rgba(0,0,0,0)')
            } else {
                n.setAttribute('fillColor', fillColor);
            }
            if (_Opt?.fillColor ) {
                _Opt.fillColor = fillColor;
            }
        }
        if (toolsType === EToolsKey.Polygon && vertices) {
            _Opt.vertices = vertices;
        }
        nodeOpt && vNodes.setInfo(node.name, {...nodeOpt, opt:_Opt});
        return BaseShapeTool.updateNodeOpt(param);
    }
}