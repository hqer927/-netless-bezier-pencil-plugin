/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Sprite } from "spritejs";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { BaseShapeTool } from "./base";
import { getRectRotated, getRectScaleed, getRectTranslated } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
export class ImageShape extends BaseShapeTool {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "canRotate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
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
            value: EToolsKey.Image
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
        this.scaleType = this.workOptions.uniformScale ? EScaleType.proportional : EScaleType.all;
    }
    consume() {
        return { type: EPostMessageType.None };
    }
    consumeAll() {
        return { type: EPostMessageType.None };
    }
    draw(props) {
        const { layer, workId, replaceId, imageBitmap } = props;
        const { centerX, centerY, width, height, scale, rotate, translate, zIndex } = this.workOptions;
        this.fullLayer.getElementsByName(replaceId || workId).map(o => o.remove());
        this.drawLayer?.getElementsByName(replaceId || workId).map(o => o.remove());
        const attr = {
            anchor: [0.5, 0.5],
            pos: [centerX, centerY],
            name: workId,
            size: [width, height],
            zIndex
        };
        if (scale) {
            if (this.scaleType === EScaleType.proportional) {
                const minScale = Math.min(scale[0], scale[1]);
                attr.scale = [minScale, minScale];
            }
            else {
                attr.scale = scale;
            }
        }
        if (translate) {
            attr.translate = translate;
        }
        if (rotate) {
            attr.rotate = rotate;
        }
        const group = new Group(attr);
        const node = new Sprite({
            anchor: [0.5, 0.5],
            pos: [0, 0],
            size: [width, height],
            texture: imageBitmap,
            rotate: 180
        });
        group.append(node);
        layer.append(group);
        // console.log('draw-image', attr);
        const rect = group.getBoundingClientRect();
        if (rect) {
            return {
                x: Math.floor(rect.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(rect.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(rect.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(rect.height + BaseShapeTool.SafeBorderPadding * 2)
            };
        }
    }
    consumeService() {
        return;
    }
    async consumeServiceAsync(props) {
        const { isFullWork, replaceId, scene } = props;
        const { src, uuid } = this.workOptions;
        const workId = this.workId?.toString() || uuid;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        if (src) {
            const imageBitmaps = await scene.preload({
                id: uuid,
                src: this.workOptions.src
            });
            // console.log('ImageBitmaps', imageBitmaps)
            const rect = this.draw({ workId, layer, replaceId, imageBitmap: imageBitmaps[0] });
            this.oldRect = workId && this.vNodes.get(workId)?.rect || undefined;
            this.vNodes.setInfo(workId, {
                rect,
                op: [],
                opt: this.workOptions,
                toolsType: this.toolsType,
                scaleType: this.scaleType,
                canRotate: this.canRotate,
                centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
            });
            // console.log('consumeServiceAsync---1', rect)
            return rect;
        }
    }
    clearTmpPoints() {
        this.tmpPoints.length = 0;
    }
    static updateNodeOpt(param) {
        const { node, opt, vNodes, targetNode } = param;
        const { translate, box, boxScale, boxTranslate, angle, isLocked, zIndex } = opt;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt)
            return;
        const layer = node.parent;
        if (!layer)
            return;
        if (isNumber(zIndex)) {
            node.setAttribute('zIndex', zIndex);
            nodeOpt.opt.zIndex = zIndex;
        }
        if (isBoolean(isLocked)) {
            nodeOpt.opt.locked = isLocked;
        }
        if (box && boxTranslate && boxScale) {
            const { centerX, centerY, width, height, uniformScale } = nodeOpt.opt;
            if (uniformScale) {
                const minScale = Math.min(boxScale[0], boxScale[1]);
                nodeOpt.opt.scale = [minScale, minScale];
            }
            else {
                nodeOpt.opt.scale = boxScale;
            }
            nodeOpt.opt.width = Math.floor(width * boxScale[0]);
            nodeOpt.opt.height = Math.floor(height * boxScale[1]);
            const _boxTranslate = [boxTranslate[0] / layer.worldScaling[0], boxTranslate[1] / layer.worldScaling[1]];
            nodeOpt.opt.centerX = centerX + _boxTranslate[0];
            nodeOpt.opt.centerY = centerY + _boxTranslate[1];
            const newCenterPos = [nodeOpt.centerPos[0] + _boxTranslate[0], nodeOpt.centerPos[1] + _boxTranslate[1]];
            nodeOpt.centerPos = newCenterPos;
            if (targetNode) {
                let rect = getRectScaleed(nodeOpt.rect, boxScale);
                rect = getRectTranslated(rect, _boxTranslate);
                nodeOpt.rect = rect;
            }
        }
        else if (translate) {
            const _translate = [translate[0] / layer.worldScaling[0], translate[1] / layer.worldScaling[1]];
            nodeOpt.opt.centerX = nodeOpt.opt.centerX + _translate[0];
            nodeOpt.opt.centerY = nodeOpt.opt.centerY + _translate[1];
            nodeOpt.centerPos = [nodeOpt.centerPos[0] + _translate[0], nodeOpt.centerPos[1] + _translate[1]];
            if (targetNode) {
                const rect = getRectTranslated(nodeOpt.rect, _translate);
                nodeOpt.rect = rect;
            }
        }
        else if (isNumber(angle)) {
            node.setAttribute('rotate', angle);
            nodeOpt.opt.rotate = angle;
            if (targetNode) {
                const rect = getRectRotated(nodeOpt.rect, angle);
                nodeOpt.rect = rect;
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        // console.log('targetNode', targetNode, vNodes.get(node.name))
        return nodeOpt?.rect;
    }
}
