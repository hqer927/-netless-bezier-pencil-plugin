/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Layer, Scene, Sprite } from "spritejs";
import { IRectType, IUpdateNodeOpt, BaseNodeMapItem } from "../types";
import { EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { Point2d } from "../utils/primitives/Point2d";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { getRectFromPoints, getRectRotated, getRectRotatedPoints, getRectScaleed, getRectTranslated, getRotatePoints, getScalePoints } from "../utils";
import { VNodeManager } from "../vNodeManager";
import { ShapeNodes } from "./utils";
import cloneDeep from "lodash/cloneDeep";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import { Vec2d } from "../utils/primitives/Vec2d";

export interface ImageOptions extends BaseShapeOptions {
    /** 图片的唯一识别符 */
    uuid: string;
    /** 图片中点在世界坐标系中的 x 坐标 */
    centerX: number;
    /** 图片中点在世界坐标系中的 y 坐标 */
    centerY: number;
    /** 图片中点在世界坐标系中的宽 */
    width: number;
    /** 图片中点在世界坐标系中的高 */
    height: number;
    /** 图片是否被锁定 */
    locked: boolean;
    /** 图片是否禁止非等比放缩 */
    uniformScale?: boolean;
    /** 是否以跨域方式加载图片 */
    crossOrigin?: boolean | string;
    /** 图片地址 */
    src: string;
}
export class ImageShape extends BaseShapeTool{
    readonly canRotate: boolean = true;
    scaleType: EScaleType = EScaleType.all;
    readonly toolsType: EToolsKey = EToolsKey.Image;
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: ImageOptions;
    oldRect?: IRectType;

    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as ImageOptions;
        this.scaleType = ImageShape.getScaleType(this.workOptions);
    }
    consume() {
        return {type:EPostMessageType.None}
    }
    consumeAll() {
        return {type:EPostMessageType.None}
    }
    private draw(props:{
        workId:string;
        layer:Group;
        replaceId?: string;
        imageBitmap:ImageBitmap;
        isMainThread?:boolean;
    }){
        const {layer, workId, replaceId, imageBitmap, isMainThread} = props;
        const {centerX,centerY, width, height, rotate, zIndex} = this.workOptions;
        const isgl = !!(layer.parent as Layer).gl;
        const attr:any = {
            anchor:[0.5,0.5],
            pos: [centerX, centerY],
            name: workId,
            size: [width, height],
            zIndex,
            rotate: !isMainThread && !isgl && (180 + (rotate || 0)) || rotate,
            texture: imageBitmap,
        };
        const node = new Sprite(attr);
        this.replace(layer, replaceId || workId, node);
        const rect = node.getBoundingClientRect();
        if(rect) {
            return {
                x: Math.floor(rect.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(rect.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(rect.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(rect.height + BaseShapeTool.SafeBorderPadding * 2)
            }
        }
    }
    consumeService(): IRectType | undefined {
        return;
    }
    async consumeServiceAsync(props: {isFullWork: boolean, scene:Scene, replaceId?: string, isMainThread?:boolean}): Promise<IRectType | undefined> {
        const {isFullWork, replaceId, scene, isMainThread} = props
        const {src,uuid} = this.workOptions;
        const workId = this.workId?.toString() || uuid;
        const layer = isFullWork ? this.fullLayer : (this.drawLayer || this.fullLayer);
        if (src) {
            const imageBitmaps:ImageBitmap[] = await scene.preload({
                id: uuid,
                src: this.workOptions.src
            });
            const rect = this.draw({workId,layer, replaceId, imageBitmap:imageBitmaps[0], isMainThread});
            this.oldRect = workId && this.vNodes?.get(workId)?.rect || undefined;
            this.vNodes?.setInfo(workId, {
                rect,
                op:[],
                opt: this.workOptions,
                toolsType: this.toolsType,
                scaleType: this.scaleType,
                canRotate: this.canRotate,
                centerPos: rect && BaseShapeTool.getCenterPos(rect, layer)
            })
            return rect;
        }
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
    static getScaleType(opt:ImageOptions){
        const {uniformScale, rotate} = opt;
        if (uniformScale !== false) {
            return EScaleType.proportional
        }
        if (rotate && Math.abs(rotate) % 90 > 0) {
            return EScaleType.proportional
        }
        return EScaleType.all
    }
    static updateNodeOpt(param:{
        node: ShapeNodes,
        opt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        willSerializeData?: boolean,
        targetNode?: BaseNodeMapItem,
    }){
        const {node, opt, vNodes, targetNode} = param;
        const {translate, box, boxScale, boxTranslate, angle, isLocked, zIndex} = opt;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt) return;
        const layer = node.parent as Group;
        if(!layer) return;
        if (isNumber(zIndex)) {
            node.setAttribute('zIndex',zIndex);
            nodeOpt.opt.zIndex = zIndex;
        }
        if(isBoolean(isLocked)){
            (nodeOpt.opt as ImageOptions).locked = isLocked;
        }
        if (box && boxTranslate && boxScale) {
            const {centerX, centerY, width, height, uniformScale, rotate} = nodeOpt.opt as ImageOptions;
            const minScale = Math.min(boxScale[0],boxScale[1]);
            const scale:[number,number] = uniformScale !== false ? [minScale, minScale]: boxScale;
            const points = getRectRotatedPoints({
                x: centerX - width / 2,
                y: centerY - height / 2,
                w: width,
                h: height,
            }, rotate || 0)
            const sPoints = getScalePoints(points, new Vec2d(centerX, centerY), scale);
            const oPoints = getRotatePoints(sPoints, new Vec2d(centerX, centerY), -(rotate || 0));
            const r = getRectFromPoints(oPoints);
            (nodeOpt.opt as ImageOptions).width = Math.round(r.w);
            (nodeOpt.opt as ImageOptions).height = Math.round(r.h);
            const _boxTranslate:[number,number] = [boxTranslate[0] / layer.worldScaling[0], boxTranslate[1] / layer.worldScaling[1]];
            (nodeOpt.opt as ImageOptions).centerX = centerX + _boxTranslate[0];
            (nodeOpt.opt as ImageOptions).centerY = centerY + _boxTranslate[1];
            const newCenterPos:[number,number] = [nodeOpt.centerPos[0] + _boxTranslate[0],nodeOpt.centerPos[1]+ _boxTranslate[1]];
            nodeOpt.centerPos = newCenterPos;
            if (targetNode) {
                let rect = getRectScaleed(nodeOpt.rect, boxScale);
                rect = getRectTranslated(rect, _boxTranslate);
                nodeOpt.rect = rect;
            } else {
                const rect = BaseShapeTool.getRectFromLayer(layer, node.name);
                nodeOpt.rect = rect || nodeOpt.rect;
            }
        } else if (translate) {
            (nodeOpt.opt as ImageOptions).centerX = (nodeOpt.opt as ImageOptions).centerX + translate[0];
            (nodeOpt.opt as ImageOptions).centerY = (nodeOpt.opt as ImageOptions).centerY + translate[1];
            nodeOpt.centerPos = [nodeOpt.centerPos[0]+translate[0],nodeOpt.centerPos[1]+translate[1]];
            if (targetNode) {
                const _translate:[number,number] = [translate[0] * layer.worldScaling[0], translate[1] * layer.worldScaling[1]];
                const rect = getRectTranslated(nodeOpt.rect, _translate);
                nodeOpt.rect = rect;
            } else {
                const rect = BaseShapeTool.getRectFromLayer(layer, node.name);
                nodeOpt.rect = rect || nodeOpt.rect;
            }
        } else if (isNumber(angle)) {
            nodeOpt.opt.rotate = angle;
            nodeOpt.scaleType = ImageShape.getScaleType(nodeOpt.opt as ImageOptions);
            if (targetNode) {
                const rect = getRectRotated(nodeOpt.rect, angle);
                nodeOpt.rect = rect;
            } else {
                const rect = BaseShapeTool.getRectFromLayer(layer, node.name);
                nodeOpt.rect = rect || nodeOpt.rect;
            }
        }
        nodeOpt && vNodes.setInfo(node.name, nodeOpt);
        return nodeOpt?.rect;
    }
}