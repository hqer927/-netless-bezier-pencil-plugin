/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Label, Polyline, Sprite, Layer, TextImage, Scene } from "spritejs";
import { BaseNodeMapItem, IRectType, IUpdateNodeOpt } from "../types";
import { EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeTool, BaseShapeToolProps } from "./base";
import { TextOptions } from "../../component/textEditor";
import { ShapeNodes } from "./utils";
import cloneDeep from "lodash/cloneDeep";
import { VNodeManager } from "../vNodeManager";
import isBoolean from "lodash/isBoolean";
import { computRect, getRectScaleed, getRectTranslated, strlen } from "../utils";
import isNumber from "lodash/isNumber";
import { transformToNormalData } from "../../collector/utils";

export class TextShape extends BaseShapeTool {
    // 4k
    static textImageSnippetSize: number = 1024 * 4;
    static SafeBorderPadding: number = 30;
    readonly canRotate: boolean = false;
    readonly scaleType: EScaleType = EScaleType.proportional;
    readonly toolsType: EToolsKey = EToolsKey.Text;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: TextOptions;
    oldRect?: IRectType;
    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as TextOptions;
    }
    consume() {
        return {
            type:EPostMessageType.None
        }
    }
    consumeAll() {
        return {
            type:EPostMessageType.None
        }
    }
    consumeService(): IRectType | undefined {
        return ;
    }
    private async draw(props:{
        workId: string;
        layer: Group;
        isDrawLabel?: boolean;
    }):Promise<IRectType | undefined>{
        const {workId, layer, isDrawLabel} = props;
        const {boxSize, boxPoint, zIndex} = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        if (!boxPoint || !boxSize) {
            return undefined
        }
        const attr = {
            name: workId, 
            id: workId, 
            pos: [boxPoint[0], boxPoint[1]],
            anchor: [0, 0],
            size: boxSize,
            zIndex
        }
        const group = new Group(attr);
        const rect = {
            x: boxPoint[0],
            y: boxPoint[1],
            w: boxSize[0],
            h: boxSize[1]
        }
        const r = {
            x: Math.floor(rect.x * worldScaling[0] + worldPosition[0]),
            y: Math.floor(rect.y * worldScaling[1] + worldPosition[1]),
            w: Math.floor(rect.w * worldScaling[0]) + 2,
            h: Math.floor(rect.h * worldScaling[1]) + 2
        };
        this.replace(layer, workId, group);
        if (isDrawLabel && layer && this.workOptions.text) {
            const result = await TextShape.createLabels(this.workOptions, layer, r);
            const {labels, maxWidth} = result
            group.append(...labels);
            r.w = Math.ceil(Math.max(maxWidth * layer.worldScaling[0], r.w));
        }
        return r;
    }
    async consumeServiceAsync(props:{isFullWork:boolean, replaceId?:string, isDrawLabel?:boolean}): Promise<IRectType | undefined> {
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        const {isFullWork, replaceId, isDrawLabel}= props;
        this.oldRect = replaceId && this.vNodes?.get(replaceId)?.rect || undefined;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect = await this.draw({workId, layer, isDrawLabel: typeof isDrawLabel === 'undefined' && this.workOptions.workState === EvevtWorkState.Done || isDrawLabel})
        this.vNodes?.setInfo(workId, {
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
    updataOptService(): IRectType | undefined {
        return;
    }
    async updataOptServiceAsync(updateNodeOpt: IUpdateNodeOpt, isDrawLabel?:boolean): Promise<IRectType | undefined> {
        if(!this.workId){
            return;
        }
        const workId = this.workId.toString();
        const {fontColor,fontBgColor, bold, italic, lineThrough, underline, zIndex} = updateNodeOpt;
        const info = this.vNodes?.get(workId);
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
        if (isNumber(zIndex)) {
            info.opt.zIndex = zIndex;
        }
        this.oldRect = info.rect;
        const rect = await this.draw({
            workId,
            layer: this.fullLayer,
            isDrawLabel: typeof isDrawLabel === 'undefined' && this.workOptions.workState === EvevtWorkState.Done || isDrawLabel
        })
        this.vNodes?.setInfo(workId, {
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
    static getSafetySnippetRatio(layer:Group) {
        const dpr = (layer?.parent as Layer).displayRatio || 1;
        const workdScale = Math.ceil(layer.worldScaling[0] * 10) / 10;
        let rato = workdScale;
        if (workdScale >= 0.2 && workdScale < 1) {
            rato = workdScale * dpr;
        } else if ( workdScale <= 2 && workdScale >= 1 ) {
            rato = workdScale * dpr * 1.6;
        } else if( workdScale > 2 && workdScale <= 3) {
            rato = workdScale * dpr * 1.4;
        } else if( workdScale > 3 && workdScale <= 4) {
            rato = workdScale * dpr * 0.8;
        } else if( workdScale > 4) {
            rato = workdScale * dpr * 0.6;
        }
        return Math.floor(rato * 1000) / 1000;
    }
    static getSafetySnippetFontLength(fontSize:number) {
        return Math.floor((TextShape.textImageSnippetSize * 3 / 4 / fontSize)) || 1;
    }   
    static async createLabels(textOpt:TextOptions, layer:Group, groupRect:IRectType){
        const labels:Array< Label | Polyline | Group | Sprite> = [];
        const {x,y} = groupRect;
        const {width,height} = (layer.parent?.parent as Scene);
        const arr = transformToNormalData(textOpt.text);
        const length = arr.length;
        const {fontSize,lineHeight, bold, textAlign, italic, fontFamily, verticalAlign, fontColor, fontBgColor, underline, lineThrough} = textOpt;
        const scale = TextShape.getSafetySnippetRatio(layer) || 1;   
        const scaleFontSize = Math.floor(fontSize * scale);   
        const maxSnippetLength = TextShape.getSafetySnippetFontLength(scaleFontSize);
        let maxWidth = 0;
        for (let i = 0; i < length; i++) {
            const text = arr[i];
            const _lineHeight = lineHeight || scaleFontSize * 1.5 ;
            if (text) {
                const length = strlen(text);
                const curLinePos:[number,number]= [0, 0];
                const curLineBoxSize:[number,number]=[0, fontSize * 1.2];
                if (verticalAlign === 'middle') {
                    curLinePos[1] = i * fontSize * 1.2 + 5;
                }
                const pos:[number,number] = [0, -fontSize * 0.15];
                curLinePos[0] = 5
                // 默认斜体20度
                const italicAngle = Math.sin(Math.PI / 180 * 20);
                let nextX:number = 0;
                const subLabels:Array<Label | Polyline> = [];
                let j = 0;
                while (j < length) {
                    if (textAlign === 'left') {
                        pos[0] = nextX;
                    }
                    if (j === 0 && italic === 'italic') {
                       pos[0] = pos[0] - (italicAngle / 2 * fontSize)
                    }
                    const t = text.slice(j, j + maxSnippetLength);
                    const labelAttr:any = {
                        anchor: [0, 0],
                        pos,
                        text: t,
                        fontFamily,
                        fontSize: scaleFontSize,
                        lineHeight: _lineHeight,
                        strokeColor: fontColor,
                        fontWeight: bold,
                        fillColor: fontColor,
                        textAlign: textAlign,
                        fontStyle: italic,
                        scale: [1 / scale, 1 / scale],
                    }
                    const label = new Label(labelAttr);
                    const r = await label.textImageReady as TextImage;
                    let isRender = true;
                    if (r) {
                        const textWidth = r.rect && r.rect[2];
                        const textHeight = r.rect && r.rect[3];
                        if (textWidth && textHeight) {
                            const originWidth = textWidth / scale;
                            const originHeight = textHeight / scale;
                            nextX = originWidth + nextX;
                            if (italic === 'italic') {
                                if (bold === 'bold') {
                                    nextX  = nextX - (italicAngle * fontSize * 1.2)
                                } else {
                                    nextX = nextX - (italicAngle * fontSize);
                                }
                            }
                            if ((pos[0] + curLinePos[0] + originWidth) * layer.worldScaling[0] + x <= 0 ||  (pos[0] + curLinePos[0]) * layer.worldScaling[0] + x >= width || 
                                (pos[1] + curLinePos[1] + originHeight) * layer.worldScaling[1] + y <= 0 ||  (pos[1] + curLinePos[1]) * layer.worldScaling[1] + y >= height
                            ) {
                                label.disconnect();
                                isRender = false;
                            }
                            if (isRender) {
                                subLabels.push(label);
                            }
                        }
                    }
                    j+=maxSnippetLength;
                }
                curLineBoxSize[0] = nextX;
                if (italic === 'italic') {
                    curLineBoxSize[0] = curLineBoxSize[0] + (italicAngle * fontSize)
                }
                maxWidth = Math.max(maxWidth, curLineBoxSize[0]);
                let isRenderLine = true;
                if ((curLinePos[0] + curLineBoxSize[0]) * layer.worldScaling[0] + x <= 0 ||  curLinePos[0] * layer.worldScaling[0] + x >= width || 
                    (curLinePos[1] + curLineBoxSize[1]) * layer.worldScaling[0] + y <= 0 ||  curLinePos[1] * layer.worldScaling[1] + y >= height
                ) {
                    isRenderLine = false;
                }
                if (isRenderLine) {
                    if (underline) {
                        const height = Math.floor(fontSize / 10);
                        const underlineAttr = {
                            normalize:false,
                            pos: [0, fontSize * 1.1 + height / 2],
                            lineWidth: height,
                            points:[0,0, Math.ceil(curLineBoxSize[0]),0],
                            strokeColor: fontColor,
                            className:'underline',
                        }
                        const underlineNode = new Polyline(underlineAttr)
                        subLabels.push(underlineNode);
                    }
                    if (lineThrough) {
                        const lineThroughAttr = {
                            normalize:false,
                            pos:[0, fontSize * 1.2 / 2],
                            lineWidth: Math.floor(fontSize / 10),
                            points:[0,0, Math.ceil(curLineBoxSize[0]), 0],
                            strokeColor: fontColor,
                            className:'lineThrough',
                        }
                        const lineThroughNode = new Polyline(lineThroughAttr)
                        subLabels.push(lineThroughNode);
                    }
                    const attr = {
                        pos: curLinePos,
                        anchor: [0, 0],
                        size: curLineBoxSize,
                        bgcolor: fontBgColor,
                    }
                    const group = new Group(attr);
                    group.append(...subLabels);
                    labels.push(group);
                }
            }
        }
        return {labels, maxWidth};
    }
    static updateNodeOpt(param:{
        node: ShapeNodes,
        opt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        willSerializeData?: boolean,
        targetNode?: BaseNodeMapItem,
    }): IRectType | undefined {
        const {node, opt, vNodes, targetNode} = param;
        const {fontBgColor, fontColor, translate, box, boxScale, boxTranslate, bold, italic, 
            lineThrough, underline, fontSize, textInfos, zIndex} = opt;
        // let rect:IRectType|undefined;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt) return;
        const layer = node.parent;
        if(!layer) return;
        const _Opt = nodeOpt.opt as TextOptions;
        if (isNumber(zIndex)) {
            node.setAttribute('zIndex',zIndex);
            nodeOpt.opt.zIndex = zIndex;
        }
        if (fontColor) {
            if (_Opt.fontColor ) {
                _Opt.fontColor = fontColor;
                (node as Group).children.forEach(c=>{
                    if (c.tagName === "GROUP") {
                        (c as Group).children.forEach(s=>{
                            if (s.tagName === "LABEL") {
                                s.setAttribute('fillColor', fontColor);
                                s.setAttribute('strokeColor', fontColor);
                            } else if (s.tagName === 'POLYLINE') {
                                s.setAttribute('strokeColor', fontColor);
                            }
                        })
                    }
                })
            }
        }
        if (fontBgColor) {
            if (_Opt.fontBgColor ) {
                _Opt.fontBgColor = fontBgColor;
                (node as Group).children.forEach(c=>{
                    if (c.tagName === "GROUP") {
                        c.setAttribute('bgcolor', fontBgColor);
                    }
                })
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
            _Opt.boxPoint = [_Opt.boxPoint[0] + translate[0], _Opt.boxPoint[1] + translate[1]];
            nodeOpt.centerPos = [nodeOpt.centerPos[0] + translate[0], nodeOpt.centerPos[1] + translate[1]];
            if (targetNode) {
                const _translate:[number,number] = [translate[0] / layer.worldScaling[0], translate[1] / layer.worldScaling[1]];
                nodeOpt.rect = getRectTranslated(nodeOpt.rect, _translate)
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        return nodeOpt?.rect;
    }
    static getRectFromLayer(layer: Group, name:string): IRectType|undefined {
        const node = layer.getElementsByName(name)[0] as Group;
        if (node) {
            const r = node.getBoundingClientRect();
            let rect:IRectType|undefined = {
                x: Math.floor(r.x - TextShape.SafeBorderPadding * layer.worldScaling[0]),
                y: Math.floor(r.y - TextShape.SafeBorderPadding * layer.worldScaling[1]),
                w: Math.floor(r.width + TextShape.SafeBorderPadding * layer.worldScaling[0] * 2),
                h: Math.floor(r.height + TextShape.SafeBorderPadding * layer.worldScaling[1] * 2)
            };
            (node as Group).children.forEach(c=>{
                if (c.tagName === "GROUP") {
                    const r = node.getBoundingClientRect();
                    rect = computRect(rect, {
                        x: Math.floor(r.x - TextShape.SafeBorderPadding * layer.worldScaling[0]),
                        y: Math.floor(r.y - TextShape.SafeBorderPadding * layer.worldScaling[1]),
                        w: Math.floor(r.width + TextShape.SafeBorderPadding * layer.worldScaling[0] * 2),
                        h: Math.floor(r.height + TextShape.SafeBorderPadding * layer.worldScaling[1] * 2)
                    });
                }
            })
            return rect
        }
        return undefined
    }
}