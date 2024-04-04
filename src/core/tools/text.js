/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rect, Group, Label } from "spritejs";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { BaseShapeTool } from "./base";
import cloneDeep from "lodash/cloneDeep";
import { getRectScaleed, getRectTranslated } from "../utils";
export class TextShape extends BaseShapeTool {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "canRotate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "scaleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EScaleType.all
        });
        Object.defineProperty(this, "toolsType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EToolsKey.Text
        });
        Object.defineProperty(this, "tmpPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "workOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "oldRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.workOptions = props.toolsOpt;
    }
    consume() {
        return {
            type: EPostMessageType.None
        };
    }
    consumeAll() {
        return {
            type: EPostMessageType.None
        };
    }
    draw(props) {
        const { workId, layer } = props;
        this.fullLayer.getElementsByName(workId).map(o => o.remove());
        this.drawLayer?.getElementsByName(workId).map(o => o.remove());
        const { boxSize, boxPoint, strokeColor } = this.workOptions;
        const worldPosition = layer.worldPosition;
        const worldScaling = layer.worldScaling;
        if (!boxPoint || !boxSize) {
            return undefined;
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
        };
        // console.log('boxSize', boxSize, rect)
        const node = new Rect({
            normalize: true,
            pos: [0, 0],
            size: boxSize,
            // fillColor: strokeColor,
            lineWidth: 0,
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
    consumeService(props) {
        const workId = this.workId?.toString();
        if (!workId) {
            return;
        }
        const { isFullWork, replaceId } = props;
        this.oldRect = replaceId && this.vNodes.get(replaceId)?.rect || undefined;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        const rect = this.draw({ workId, layer });
        this.vNodes.setInfo(workId, {
            rect,
            op: [],
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
        });
        return rect;
    }
    updataOptService(updateNodeOpt) {
        // console.log('updataOptService-text', updateNodeOpt)
        if (!this.workId) {
            return;
        }
        const workId = this.workId.toString();
        const { fontColor, fontBgColor } = updateNodeOpt;
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
        });
        this.vNodes.setInfo(workId, {
            rect,
            op: [],
            opt: this.workOptions,
            toolsType: this.toolsType,
            scaleType: this.scaleType,
            canRotate: this.canRotate,
            centerPos: rect && BaseShapeTool.getCenterPos(rect, this.fullLayer)
        });
        return rect;
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
    }
    static createLabels(textOpt, rect) {
        const labels = [];
        const length = textOpt.text.length;
        for (let i = 0; i < length; i++) {
            const text = textOpt.text[i];
            const attr = {
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
            const pos = [0, 0];
            if (textOpt.verticalAlign === 'middle') {
                const center = (length - 1) / 2;
                pos[1] = (i - center) * attr.lineHeight;
            }
            if (textOpt.textAlign === 'left') {
                pos[0] = -rect.w / 2;
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
    static updateNodeOpt(param) {
        const { node, opt, vNodes, targetNode } = param;
        const { fontBgColor, fontColor, translate, box, boxScale, boxTranslate, workState } = opt;
        // let rect:IRectType|undefined;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt)
            return;
        const layer = node.parent;
        if (!layer)
            return;
        const _Opt = nodeOpt.opt;
        _Opt.workState = workState;
        if (fontColor) {
            if (_Opt.fontColor) {
                _Opt.fontColor = fontColor;
            }
        }
        if (fontBgColor) {
            if (_Opt.fontBgColor) {
                _Opt.fontBgColor = fontBgColor;
            }
        }
        if (box && boxTranslate && boxScale) {
            const { boxSize, fontSize } = _Opt;
            const oldRect = nodeOpt.rect;
            const newRect = getRectTranslated(getRectScaleed(oldRect, boxScale), boxTranslate);
            _Opt.boxPoint = newRect && [(newRect.x - layer.worldPosition[0]) / layer.worldScaling[0], (newRect.y - layer.worldPosition[1]) / layer.worldScaling[1]];
            _Opt.boxSize = boxSize && [boxSize[0] * boxScale[0], boxSize[1] * boxScale[1]];
            _Opt.fontSize = fontSize && fontSize * boxScale[0];
        }
        else if (translate && _Opt.boxPoint) {
            _Opt.boxPoint = [_Opt.boxPoint[0] + translate[0], _Opt.boxPoint[1] + translate[1]];
            nodeOpt.centerPos = [nodeOpt.centerPos[0] + translate[0], nodeOpt.centerPos[1] + translate[1]];
            nodeOpt.rect = {
                x: nodeOpt.rect.x + translate[0],
                y: nodeOpt.rect.y + translate[1],
                w: nodeOpt.rect.w,
                h: nodeOpt.rect.h,
            };
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        // console.log('targetNode', targetNode, vNodes.get(node.name))
        return nodeOpt?.rect;
    }
    static getRectFromLayer(layer, name) {
        const node = layer.getElementsByName(name)[0];
        if (node) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.floor(r.width),
                h: Math.floor(r.height)
            };
        }
        return undefined;
    }
}
