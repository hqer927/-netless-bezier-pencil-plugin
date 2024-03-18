/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect, Group, Label } from "spritejs";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt } from "../types";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeTool, BaseShapeToolProps } from "./base";
import { TextOptions } from "../../component/textEditor";
import { ShapeNodes } from "./utils";
import { VNodeManager } from "../threadEngine";
import cloneDeep from "lodash/cloneDeep";
import { getRectScaleed, getRectTranslated } from "../utils";

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
    }):IRectType | undefined{
        const {workId, layer} = props;
        this.fullLayer.getElementsByName(workId).map(o=>o.remove());
        this.drawLayer?.getElementsByName(workId).map(o=>o.remove());
        const {boxSize, boxPoint, strokeColor} = this.workOptions;
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
            bgcolor: strokeColor,
            opacity: 0.1
        });
        const rect = {
            x: boxPoint[0],
            y: boxPoint[1],
            w: boxSize[0],
            h: boxSize[1]
        }
        console.log('boxSize', boxSize, rect)
        const node = new Rect({
            normalize: true,
            pos: [0, 0],
            size: boxSize,
            // fillColor: strokeColor,
            lineWidth:0,
          });
          group.appendChild(node);
        // const labels = TextShape.createLabels(this.workOptions, rect)
        // group.append(...labels);
        layer.append(group);
        return {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0]),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1]),
            w: Math.floor(rect.w * worldScaling[0]),
            h: Math.floor(rect.h * worldScaling[1])
        };
    }
    consumeService(props:{isFullWork:boolean, replaceId?:string}): IRectType | undefined {
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        const {isFullWork, replaceId}= props;
        this.oldRect = replaceId && this.vNodes.get(replaceId)?.rect || undefined;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect = this.draw({workId,layer})
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
        console.log('updataOptService-text', updateNodeOpt)
        if(!this.workId){
            return;
        }
        const workId = this.workId.toString();
        const {fontColor,fontBgColor} = updateNodeOpt;
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
        this.oldRect = info.rect;
        const rect = this.draw({
            workId,
            layer: this.fullLayer
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
    static createLabels(textOpt:TextOptions, rect: IRectType){
        const labels:Label[] = [];
        const length = textOpt.text.length;
        for (let i = 0; i < length; i++) {
            const text = textOpt.text[i];
            const attr:any = {
                anchor: [0.5, 0.5],
                text,
                // size:[rect.w,textOpt.fontSize],
                fontSize: textOpt.fontSize,
                lineHeight: textOpt.fontSize,
                fontFamily: textOpt.fontFamily,
                fontStyle: textOpt.fontStyle,
                fillColor: textOpt.fontColor,
                bgcolor: textOpt.fontBgColor,
                textAlign: textOpt.textAlign,
                fontWeight: textOpt.fontWeight,
            };
            const pos:[number,number] = [0,0];
            if (textOpt.verticalAlign === 'middle') {
                const center = (length - 1) / 2;
                pos[1] = (i - center) * attr.lineHeight;
            }
            if (textOpt.textAlign === 'left') {
                pos[0] = - rect.w / 2;
                attr.anchor = [0, 0.5];
            }
            // if (textOpt.textAlign === 'right') {
            //     pos[0] = rect.w / 2;
            // }
            attr.pos = pos;
            const label = new Label(attr);
            // console.log('labels', label.getBoundingClientRect(), rect);
            labels.push(label);
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
        const {fontBgColor, fontColor, translate, box, boxScale, boxTranslate, workState} = opt;
        // let rect:IRectType|undefined;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt) return;
        const layer = node.parent;
        if(!layer) return;
        const _Opt = nodeOpt.opt as TextOptions;
        _Opt.workState = workState;
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
        if (box && boxTranslate && boxScale) {
            const {boxSize, fontSize} = _Opt;
            const oldRect = nodeOpt.rect;
            const newRect = getRectTranslated(getRectScaleed(oldRect,boxScale),boxTranslate);
            _Opt.boxPoint = newRect && [(newRect.x - layer.worldPosition[0]) / layer.worldScaling[0], (newRect.y - layer.worldPosition[1]) / layer.worldScaling[1]];
            _Opt.boxSize = boxSize && [boxSize[0] * boxScale[0], boxSize[1] * boxScale[1]];
            _Opt.fontSize = fontSize && fontSize * boxScale[0];
        } else if (translate && _Opt.boxPoint) {
            _Opt.boxPoint = [_Opt.boxPoint[0] + translate[0], _Opt.boxPoint[1] + translate[1]];
            nodeOpt.centerPos = [nodeOpt.centerPos[0] + translate[0], nodeOpt.centerPos[1] + translate[1]];
            nodeOpt.rect = {
                x: nodeOpt.rect.x + translate[0],
                y: nodeOpt.rect.y + translate[1],
                w: nodeOpt.rect.w,
                h: nodeOpt.rect.h,
            }
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