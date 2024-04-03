/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ellipse, Group, Path } from "spritejs";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { computRect, getRectFromPoints } from "../utils";
import { transformToSerializableData } from "../../collector/utils";
import { VNodeManager } from "../worker/vNodeManager";
import { ShapeNodes } from "./utils";

export interface EllipseOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor:string;
    fillColor: string;
}
export class EllipseShape extends BaseShapeTool{
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.all;
    readonly toolsType: EToolsKey = EToolsKey.Ellipse;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: EllipseOptions;
    oldRect?: IRectType;
    private syncTimestamp: number;

    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as EllipseOptions;
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
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const r: IRectType | undefined = this.draw({workId, layer, isDrawing:true});
        const rect = computRect(r, this.oldRect);
        this.oldRect = r;
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId
        }
    }
    consumeAll(props: { data?: IWorkerMessage | undefined}): IMainMessage {
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
        const layer = this.fullLayer;
        const rect: IRectType | undefined = this.draw({workId, layer, isDrawing:false});
        this.oldRect = rect;
        const op = this.tmpPoints.map(c=>[...c.XY,0]).flat(1);
        const ops = transformToSerializableData(op);
        this.vNodes.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            canRotate: this.canRotate,
            scaleType: this.scaleType,
            centerPos: rect && BaseShapeTool.getCenterPos(rect,layer)
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
        layer:Group;
        /** 是否还在绘制中 */
        isDrawing: boolean;
    }){
        const {workId, layer, isDrawing} = props;
        this.fullLayer.getElementsByName(workId).map(o=>o.remove());
        this.drawLayer?.getElementsByName(workId).map(o=>o.remove());
        const {strokeColor, fillColor, thickness, zIndex, scale, rotate, translate} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        const {radius, rect, pos} = this.computDrawPoints(thickness);
        const attr:any = {
            pos,
            name: workId,
            id: workId,
            radius,
            lineWidth: thickness,
            fillColor: fillColor !== 'transparent' && fillColor || undefined, 
            strokeColor: strokeColor,
            normalize:true,
            zIndex,
        };
        const r: IRectType | undefined = {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0] - BaseShapeTool.SafeBorderPadding),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1] - BaseShapeTool.SafeBorderPadding),
            w: Math.floor(rect.w * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding),
            h: Math.floor(rect.h * worldScaling[1]  + 2 * BaseShapeTool.SafeBorderPadding)
        };
        if (isDrawing) {
            const {name, id, zIndex, strokeColor} = attr;
            const centerPos = BaseShapeTool.getCenterPos(r,layer);
            const group = new Group({
                name, id, zIndex, 
                pos: centerPos,
                anchor: [0.5, 0.5],
                size: [r.w, r.h]
            });
            const node = new Ellipse({
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
            return r;
        }
        if (scale) {
            attr.scale = scale;
        }
        if (rotate) {
            attr.rotate = rotate;
        }
        if(translate){
            attr.translate = translate;
        }
        const node = new Ellipse(attr);
        layer.append(node);
        if (rotate || scale || translate) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
            }
        }
        return r;
    }
    private computDrawPoints(thickness:number):{pos: [number,number], rect: IRectType, radius:[number,number], isDot?: boolean} {
        // const distance = this.tmpPoints[1].distance(this.tmpPoints[0]);
        const r = getRectFromPoints(this.tmpPoints);
        const rect = getRectFromPoints(this.tmpPoints, thickness);
        const centerPos:[number,number] = [Math.floor(r.x + r.w / 2), Math.floor(r.y + r.h / 2)];
        return {
            rect,
            pos: centerPos,
            radius:[Math.floor(r.w / 2), Math.floor(r.h / 2)]
        };
    }
    private updateTempPoints(op:number[]):boolean{
        const lPoint = op.slice(-2);
        const lastPoint = new Point2d(lPoint[0],lPoint[1]);
        const firstPoint = this.tmpPoints[0];
        const {thickness} = this.workOptions as EllipseOptions;
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
        const rect: IRectType | undefined = this.draw({workId, layer, isDrawing: false});
        this.oldRect = rect;
        this.vNodes.setInfo(workId, {
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
    }){
        const {node, opt, vNodes} = param;
        const {strokeColor, fillColor} = opt;
        const nodeOpt = vNodes.get(node.name);
        let n = node;
        if (node.tagName === 'GROUP') {
            n = (node as Group).children[0]
        }
        if (strokeColor) {
            n.setAttribute('strokeColor', strokeColor);
            if (nodeOpt?.opt?.strokeColor ) {
                nodeOpt.opt.strokeColor = strokeColor;
            }
        }
        if (fillColor) {
            if (fillColor === 'transparent') {
                n.setAttribute('fillColor', 'rgba(0,0,0,0)')
            } else {
                n.setAttribute('fillColor', fillColor);
            }
            if (nodeOpt?.opt?.fillColor ) {
                nodeOpt.opt.fillColor = fillColor;
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        return BaseShapeTool.updateNodeOpt(param);
    }
}