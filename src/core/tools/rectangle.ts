/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Path, Polyline } from "spritejs";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { computRect, getRectFromPoints } from "../utils";
import { transformToSerializableData } from "../../collector/utils";
import { VNodeManager } from "../worker/vNodeManager";
import { ShapeNodes } from "./utils";
import { Vec2d } from "../utils/primitives/Vec2d";
import { TextOptions } from "../../component/textEditor";
import isBoolean from "lodash/isBoolean";

export interface RectangleOptions extends BaseShapeOptions {
    thickness: number;
    strokeColor: string;
    fillColor: string;
}
export class RectangleShape extends BaseShapeTool{
    readonly canRotate: boolean = true;
    readonly scaleType: EScaleType = EScaleType.all;
    readonly toolsType: EToolsKey = EToolsKey.Rectangle;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: RectangleOptions;
    oldRect?: IRectType;
    private syncTimestamp: number;

    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as RectangleOptions;
        this.syncTimestamp = 0;
        this.syncUnitTime = 50;
    }
    private transformData() {
        const r = getRectFromPoints(this.tmpPoints);
        return [
            [r.x, r.y, 0], 
            [r.x + r.w, r.y, 0], 
            [r.x + r.w, r.y + r.h, 0], 
            [r.x, r.y + r.h, 0]
        ]
    }
    private computDrawPoints(ps:Array<number[]>): {
        rect: IRectType,
        pos: [number,number],
        points: number[]
    } {
        const {thickness} = this.workOptions;
        const vec2ds:Vec2d[] =[]
        for (const p of ps) {
            vec2ds.push(new Vec2d(...p));
        }
        const rect = getRectFromPoints(vec2ds, thickness);
        const centerPos:[number,number] = [rect.x + rect.w / 2, rect.y + rect.h / 2];
        return {
            rect,
            pos: centerPos,
            points: vec2ds.map(v=>v.XY).flat(1)
        };
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
        const points = this.transformData();
        if (!isSubWorker) {
            const now = Date.now();
            if (now - this.syncTimestamp > this.syncUnitTime) {
                this.syncTimestamp = now;
                return {
                    type: EPostMessageType.DrawWork,
                    dataType: EDataType.Local,
                    workId,
                    op: points.flat(1),
                    isSync: true,
                    index: 0
                }
            }
            return { type: EPostMessageType.None};
        }
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const r: IRectType | undefined = this.draw({ps: points, workId, layer, isDrawing:true});
        const rect = computRect(r, this.oldRect);
        this.oldRect = r;
        // console.log('consume', this.fullLayer.children.length, this.drawLayer?.children.length)
        return {
            rect,
            type: EPostMessageType.DrawWork,
            dataType: EDataType.Local,
            workId,
            // op: this.tmpPoints.map(c=>[...c.XY,0]).flat(1)
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
        const points = this.transformData();
        const layer = this.fullLayer;
        const rect: IRectType | undefined = this.draw({ps: points, workId, layer, isDrawing:false});
        this.oldRect = rect;
        const op = points.flat(1);
        const ops = transformToSerializableData(op);
        this.vNodes.setInfo(workId, {
            rect,
            op,
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
        })
        // console.log('consume-1', this.fullLayer.children.length, this.drawLayer?.children.length)
        return {
            rect,
            type: EPostMessageType.FullWork,
            dataType: EDataType.Local,
            workId,
            ops,
            opt: this.workOptions,
            isSync: true
        }
    }

    private draw(props:{
        ps:Array<number[]>,
        workId:string;
        layer:Group;
        isDrawing: boolean;
        replaceId?:string;
    }){
        const {workId, layer, isDrawing, ps, replaceId} = props;
        this.fullLayer.getElementsByName(replaceId || workId).map(o=>o.remove());
        this.drawLayer?.getElementsByName(replaceId || workId).map(o=>o.remove());
        const {strokeColor, fillColor, thickness, zIndex, scale, rotate, translate, textOpt} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        const {points, rect, pos} = this.computDrawPoints(ps);
        const attr:any = {
            close: true,
            normalize: true,
            points,
            lineWidth: thickness,
            fillColor: fillColor !== 'transparent' && fillColor || undefined, 
            strokeColor,
            lineJoin: 'round'
        };
        const r: IRectType | undefined = {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0] - BaseShapeTool.SafeBorderPadding),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1] - BaseShapeTool.SafeBorderPadding),
            w: Math.floor(rect.w * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding),
            h: Math.floor(rect.h * worldScaling[0] + 2 * BaseShapeTool.SafeBorderPadding)
        };
        const group = new Group({
            name: workId,
            id: workId,
            zIndex, 
            pos,
            anchor: [0.5, 0.5],
            size: [
                rect.w,
                rect.h
            ],
            scale,
            rotate,
            translate,
        });
        const node = new Polyline({
            ...attr,
            pos:[0, 0]
        });
        group.appendChild(node);
        if (isDrawing) {
            const anchorCross = new Path({
                d:'M-4,0H4M0,-4V4',
                normalize: true,
                pos: [0, 0],
                strokeColor,
                lineWidth: 1,
                scale:[1 / worldScaling[0], 1 / worldScaling[1]]
            });
            group.appendChild(anchorCross);
        }
        layer.append(group);
        if (textOpt) {
            // const labbels = TextShape.createLabels(textOpt, r)
            // group.append(...labbels);
            // (layer.parent as Layer)?.render();
            // labbels.forEach(c=>{
            //     console.log('labbels', c.getBoundingClientRect(), c)
            // })
        }
        if (scale || rotate || translate) {
            const r = group.getBoundingClientRect();
            return {
                x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(r.width + 2 * BaseShapeTool.SafeBorderPadding),
                h: Math.floor(r.height + 2 * BaseShapeTool.SafeBorderPadding)
            };
        }
        return r;
    }
    private updateTempPoints(op:number[]):boolean{
        const lPoint = op.slice(-2);
        const lastPoint = new Point2d(lPoint[0],lPoint[1]);
        const firstPoint = this.tmpPoints[0];
        const {thickness} = this.workOptions as RectangleOptions;
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
    consumeService(props: { op: number[]; isFullWork: boolean, replaceId?:string}): IRectType | undefined {
        const {op, isFullWork, replaceId} = props;
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        const ps:number[][] = [];
        for (let i = 0; i < op.length; i+=3) {
            ps.push([op[i],op[i+1], op[i+2]]);
        }
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect: IRectType | undefined = this.draw({ps, workId, layer, isDrawing: false, replaceId});
        this.oldRect = rect;
        this.vNodes.setInfo(workId, {
            rect,
            op,
            opt:this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect,layer)
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
        willSerializeData?: boolean
    }){
        const {node, opt, vNodes} = param;
        const {strokeColor, fillColor, fontColor, fontBgColor, bold,
            italic, lineThrough, underline, fontSize
        } = opt;
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
        if (nodeOpt?.opt.textOpt) {
            const _textOpt = nodeOpt.opt.textOpt as TextOptions;
            if (fontColor) {
                if (_textOpt.fontColor ) {
                    _textOpt.fontColor = fontColor;
                }
            }
            if (fontBgColor) {
                if (_textOpt.fontBgColor ) {
                    _textOpt.fontBgColor = fontBgColor;
                }
            }
            if (bold) {
                _textOpt.bold = bold;
            }
            if (italic) {
                _textOpt.italic = italic;
            }
            if (isBoolean(lineThrough)) {
                _textOpt.lineThrough = lineThrough;
            }
            if (isBoolean(underline)) {
                _textOpt.underline = underline;
            }
            if (fontSize) {
                _textOpt.fontSize = fontSize;
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        return BaseShapeTool.updateNodeOpt(param);
    }
}