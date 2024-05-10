/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect, Group, Label, Polyline, Layer } from "spritejs";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeTool, BaseShapeToolProps } from "./base";
import { TextOptions } from "../../component/textEditor";
import { ShapeNodes } from "./utils";
import cloneDeep from "lodash/cloneDeep";
import { VNodeManager } from "../worker/vNodeManager";
import isBoolean from "lodash/isBoolean";
import { getRectScaleed, getRectTranslated } from "../utils";
import isNumber from "lodash/isNumber";

export class TextShape extends BaseShapeTool {
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.all;
    readonly toolsType: EToolsKey = EToolsKey.Text;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: TextOptions;
    oldRect?: IRectType;
    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as TextOptions;
    }
    consume(): IMainMessage {
        return {
            type:EPostMessageType.None
        }
    }
    consumeAll(): IMainMessage {
        return {
            type:EPostMessageType.None
        }
    }
    private draw(props:{
        workId:string;
        layer: Group;
        isDrawLabel?:boolean;
    }):IRectType | undefined{
        const {workId, layer, isDrawLabel} = props;
        this.fullLayer.getElementsByName(workId).map(o=>o.remove());
        this.drawLayer?.getElementsByName(workId).map(o=>o.remove());
        const {boxSize, boxPoint, zIndex} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        if (!boxPoint || !boxSize) {
            return undefined
        }
        const group = new Group({
            name: workId, 
            id: workId, 
            pos: [boxPoint[0] + boxSize[0] / 2, boxPoint[1] + boxSize[1] / 2],
            anchor: [0.5, 0.5],
            size: boxSize,
            zIndex
        });
        const rect = {
            x: boxPoint[0],
            y: boxPoint[1],
            w: boxSize[0],
            h: boxSize[1]
        }
        const node = new Rect({
            normalize: true,
            pos: [0, 0],
            size: boxSize,
        });
        const labels = isDrawLabel && TextShape.createLabels(this.workOptions, layer) || [];
        group.append(...labels, node);
        layer.append(group);
        return {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0]),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1]),
            w: Math.floor(rect.w * worldScaling[0]),
            h: Math.floor(rect.h * worldScaling[1])
        };
    }
    consumeService(props:{isFullWork:boolean, replaceId?:string, isDrawLabel?:boolean}): IRectType | undefined {
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        const {isFullWork, replaceId, isDrawLabel}= props;
        this.oldRect = replaceId && this.vNodes.get(replaceId)?.rect || undefined;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect = this.draw({workId,layer, isDrawLabel})
        this.vNodes.setInfo(workId, {
            rect,
            op:[],
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
        })
        return rect
    }
    updataOptService(updateNodeOpt: IUpdateNodeOpt): IRectType | undefined {
        // console.log('updataOptService-text', updateNodeOpt)
        if(!this.workId){
            return;
        }
        const workId = this.workId.toString();
        const {fontColor,fontBgColor, bold, italic, lineThrough, underline, zIndex} = updateNodeOpt;
        const info = this.vNodes.get(workId);
        if (!info) {
            return;
        }
        if (fontColor) {
            info.opt.fontColor = fontColor;
        }
        if (fontBgColor) {
            info.opt.fontBgColor = fontBgColor;
        }
        if (bold) {
            (info.opt as TextOptions).bold = bold;
        }
        if (italic) {
            (info.opt as TextOptions).italic = italic;
        }
        if (isBoolean(lineThrough)) {
            (info.opt as TextOptions).lineThrough = lineThrough;
        }
        if (isBoolean(underline)) {
            (info.opt as TextOptions).underline = underline;
        }
        if (fontBgColor) {
            info.opt.fontBgColor = fontBgColor;
        }
        if (isNumber(zIndex)) {
            info.opt.zIndex = zIndex;
        }
        this.oldRect = info.rect;
        const rect = this.draw({
            workId,
            layer: this.fullLayer,
            isDrawLabel: false
        })
        this.vNodes.setInfo(workId, {
            rect,
            op:[],
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, this.fullLayer)
        })
        return rect;
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
    static getFontWidth(param:{
        text: string,
        ctx:OffscreenCanvasRenderingContext2D,
        opt: TextOptions,
        worldScaling:number[]
    }){
        const {ctx,opt, text}= param;
        const {bold, italic, fontSize, fontFamily} = opt;
        ctx.font = `${bold} ${italic} ${fontSize}px ${fontFamily}`;
        return ctx.measureText(text).width;
    }
    static createLabels(textOpt:TextOptions, layer: Group){
        const labels:Array<Label|Polyline> = [];
        const arr = textOpt.text.split(',');
        const length = arr.length;
        // console.log('textOpt.text', textOpt.text, textOpt.boxSize, layer.worldScaling)
        for (let i = 0; i < length; i++) {
            const text = arr[i];
            const {fontSize,lineHeight, bold,textAlign,italic, boxSize, fontFamily, verticalAlign, fontColor, underline, lineThrough} = textOpt;
            const _lineHeight = lineHeight || fontSize * 1.2;
            const ctx = layer && (layer.parent as Layer).canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
            const width = ctx && TextShape.getFontWidth({text,opt:textOpt,ctx, worldScaling:layer.worldScaling});
            if (width) {
                const attr:any = {
                    anchor: [0, 0.5],
                    text,
                    fontSize: fontSize,
                    lineHeight: _lineHeight,
                    fontFamily: fontFamily,
                    fontWeight: bold,
                    // fillColor: '#000',
                    fillColor: fontColor,
                    textAlign: textAlign,
                    fontStyle: italic,
                    name:i.toString(),
                    className:'label'
                };
                const pos:[number,number] = [0,0];
                if (verticalAlign === 'middle') {
                    const center = (length - 1) / 2;
                    pos[1] = (i - center) * _lineHeight;
                }
                if (textAlign === 'left') {
                    pos[0] = boxSize && -boxSize[0] / 2 + 5 || 0;
                }
                // if (textOpt.textAlign === 'right') {
                //     pos[0] = rect.w / 2;
                //     attr.anchor = [0.5, 0.5];
                // }
                attr.pos = pos;
                const label = new Label(attr);
                labels.push(label);
                if (underline) {
                    // console.log('textOpt.text--1', attr.pos)
                    const underlineAttr = {
                        normalize:false,
                        pos:[attr.pos[0], attr.pos[1] + fontSize / 2],
                        lineWidth:2 * layer.worldScaling[0],
                        points:[0,0,width,0],
                        strokeColor: fontColor,
                        name:`${i}_underline`,
                        className:'underline'
                    }
                    const underlineNode = new Polyline(underlineAttr)
                    labels.push(underlineNode);
                }
                if (lineThrough) {
                    const lineThroughAttr = {
                        normalize:false,
                        pos: attr.pos,
                        lineWidth:2 * layer.worldScaling[0],
                        points:[0,0,width,0],
                        strokeColor: fontColor,
                        name:`${i}_lineThrough`,
                        className:'lineThrough'
                    }
                    const lineThroughNode = new Polyline(lineThroughAttr)
                    labels.push(lineThroughNode);
                }
                // console.log('textOpt.text--1', text, width, label.getBoundingClientRect());
            }
        }
        return labels;
    }
    static updateNodeOpt(param:{
        node: ShapeNodes,
        opt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        willSerializeData?: boolean,
        targetNode?: BaseNodeMapItem,
    }): IRectType | undefined {
        const {node, opt, vNodes, targetNode} = param;
        const {fontBgColor, fontColor, translate, box, boxScale, boxTranslate, bold, italic, lineThrough, underline, fontSize, textInfos} = opt;
        // let rect:IRectType|undefined;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt) return;
        const layer = node.parent;
        if(!layer) return;
        const _Opt = nodeOpt.opt as TextOptions;
        if (fontColor) {
            if (_Opt.fontColor ) {
                _Opt.fontColor = fontColor;
            }
        }
        if (fontBgColor) {
            if (_Opt.fontBgColor ) {
                _Opt.fontBgColor = fontBgColor;
            }
        }
        if (bold) {
            _Opt.bold = bold;
        }
        if (italic) {
            _Opt.italic = italic;
        }
        if (isBoolean(lineThrough)) {
            _Opt.lineThrough = lineThrough;
        }
        if (isBoolean(underline)) {
            _Opt.underline = underline;
        }
        if (fontSize) {
            _Opt.fontSize = fontSize;
        }
        if (box && boxTranslate && boxScale) {
            const textinfo = textInfos?.get(node.name);
            if (textinfo) {
                const{fontSize,boxSize} = textinfo;
                _Opt.boxSize = boxSize || _Opt.boxSize;
                _Opt.fontSize = fontSize || _Opt.fontSize;
            }
            const oldRect = nodeOpt.rect;
            const newRect = getRectTranslated(getRectScaleed(oldRect,boxScale),boxTranslate);
            _Opt.boxPoint = newRect && [(newRect.x - layer.worldPosition[0]) / layer.worldScaling[0], (newRect.y - layer.worldPosition[1]) / layer.worldScaling[1]];
        } else if (translate && _Opt.boxPoint) {
            const _translate:[number,number] = [translate[0] / layer.worldScaling[0], translate[1] / layer.worldScaling[1]];
            _Opt.boxPoint = [_Opt.boxPoint[0] + _translate[0], _Opt.boxPoint[1] + _translate[1]];
            nodeOpt.centerPos = [nodeOpt.centerPos[0] + _translate[0], nodeOpt.centerPos[1] + _translate[1]];
            nodeOpt.rect = getRectTranslated(nodeOpt.rect, _translate)
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        // console.log('targetNode', targetNode, vNodes.get(node.name))
        return nodeOpt?.rect;
    }
    static getRectFromLayer(layer: Group, name:string): IRectType|undefined {
        const node = layer.getElementsByName(name)[0] as Group;
        if (node) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.floor(r.width),
                h: Math.floor(r.height)
            }
        }
        return undefined
    }
}