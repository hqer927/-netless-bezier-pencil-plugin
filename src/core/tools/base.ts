/* eslint-disable @typescript-eslint/no-explicit-any */
import { Point2d } from "../utils/primitives/Point2d";
import { EDataType, EPostMessageType, EScaleType, EToolsKey } from "../enum";
import { BaseNodeMapItem, IMainMessage, IRectType, IUpdateNodeOpt, IWorkerMessage } from "../types";
import { Group} from "spritejs";
import { VNodeManager } from "../vNodeManager";
import { checkOp, computRect, getRectFromPoints, getRectRotated, getRectTranslated, rotatePoints, scalePoints } from "../utils";
import { ShapeNodes, ShapeOptions } from "./utils";
import isNumber from "lodash/isNumber";
import cloneDeep from "lodash/cloneDeep";
import { TextOptions } from "../../component/textEditor/types";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export interface BaseShapeOptions {
    isOpacity?: boolean;
    fontColor?: string;
    fontBgColor?: string;
    strokeColor?: string;
    fillColor?: string;
    vertex?: string;
    fragment?: string;
    syncUnitTime?: number;
    zIndex?: number;
    scale?:[number,number];
    rotate?:number;
    thickness?:number;
    textOpt?: TextOptions;
    translate?:[number,number];
}
export interface BaseShapeToolProps {
    workId: string;
    vNodes?: VNodeManager;
    toolsOpt: ShapeOptions;
    fullLayer: Group;
    drawLayer?: Group;
}
export type BaseConsumeResultType = {
    type: EPostMessageType;
    toolsType?: EToolsKey;
    opt?: ShapeOptions;
    workId?: string;
    dataType?: EDataType;
} & Partial<IMainMessage>;

export abstract class BaseShapeTool {
    static SafeBorderPadding = 10;
    protected abstract tmpPoints: Array<Point2d | number>;
    readonly abstract toolsType: EToolsKey;
    readonly abstract canRotate: boolean;
    readonly abstract scaleType: EScaleType;
    syncUnitTime: number = DefaultAppliancePluginOptions.syncOpt.interval;
    vNodes?:VNodeManager;
    protected drawLayer?: Group;
    protected fullLayer: Group;
    protected workId: string;
    protected abstract workOptions: ShapeOptions;
    constructor(props:BaseShapeToolProps) {
        const {vNodes, fullLayer, drawLayer, workId, toolsOpt} = props;
        this.vNodes = vNodes;
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
        this.workId = workId;
        this.syncUnitTime = toolsOpt.syncUnitTime || this.syncUnitTime;
    }
    get baseConsumeResult(){
        return {
            workId: this.workId,
            toolsType: this.toolsType,
            opt: this.workOptions
        }
    }
    /** 消费本地数据，返回绘制结果 */
    abstract consume(props:{
        data: IWorkerMessage;
        isFullWork?:boolean;
        isSubWorker?:boolean;
        drawCount?:number;
        isMainThread?:boolean;
    }): BaseConsumeResultType;
    /** 消费本地完整数据，返回绘制结果 */
    abstract consumeAll(props:{data?: IWorkerMessage}): BaseConsumeResultType;
    /** 消费服务端数据，返回绘制结果 */
    abstract consumeService(props:{
        op: number[];
        isFullWork:boolean;
        replaceId?: string;
    }): IRectType | undefined;
    protected filterSamePoints(points: Point2d[], tolerance:number = 0.01){
        return points.reduce((total, cur)=>{
          const lastPoint = total[total.length - 1];
          if (cur && !lastPoint) {
            total.push(cur);
          } else if (cur && lastPoint && !cur.isNear(lastPoint, tolerance)) {
            total.push(cur);
          }
          return total;
        },[] as Array<Point2d>
    )}
    /** 清除临时数据 */
    abstract clearTmpPoints():void;
    /** 设置工作id */
    setWorkId(id: string) {
        this.workId = id;
    }
    getWorkId(){
        return this.workId;
    }
    /** 获取工作选项配置 */
    getWorkOptions(){
        return this.workOptions;
    }
    /** 设置工作选项配置 */
    setWorkOptions(workOptions: BaseShapeOptions) {
        this.workOptions = workOptions;
        this.syncUnitTime = workOptions.syncUnitTime || this.syncUnitTime;
        const key = this.workId?.toString();
        const info = key && this.vNodes?.get(key) || undefined;
        if(key && info){
            info.opt = workOptions;
            this.vNodes?.setInfo(key,info);
        }
    }
    /** 更新服务端同步配置,返回绘制结果 */
    updataOptService(opt?: IUpdateNodeOpt): IRectType | undefined {
        let rect:IRectType|undefined;
        const name = this.workId?.toString();
        if(name && opt){
            const paths = (this.fullLayer.getElementsByName(name) as ShapeNodes[]) || (this.drawLayer && this.drawLayer.getElementsByName(name) as ShapeNodes[]) || []
            if(paths.length !== 1){
                return;
            }
            const path = paths[0];
            const { pos, zIndex, scale, angle, translate } = opt;
            const attr:any = {};
            if (isNumber(zIndex)) {
                attr.zIndex = zIndex;
            }
            if (pos) {
                attr.pos = [pos[0],pos[1]];
            }
            if (scale) {
                attr.scale = scale;
            }
            if (angle) {
                attr.rotate = angle;
            }
            if (translate) {
                attr.translate = translate;
            }
            path.attr(attr);
            const r = path?.getBoundingClientRect();
            if (r) {
                rect = computRect(rect, {
                    x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                    y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                    w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                    h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
                })
            }
            this.vNodes?.setInfo(name, {
                rect,
                centerPos: pos
            })
          return rect;
        }
        return ;
    }
    replace(layer:Group, replaceId:string, newNode?:ShapeNodes){
        const olds = layer.getElementsByName(replaceId);
        const length = olds.length;
        if (length) {
            if (length > 1) {
                for (let i = 1; i < olds.length; i++) {
                    layer.removeChild(olds[i]);
                    olds[i].disconnect();
                }
            }
            if (newNode) {
                layer.replaceChild(newNode, olds[0]);
            } else {
                layer.removeChild(olds[0]);
            }
            olds[0].disconnect();
        } else if (newNode) {
            layer.append(newNode);
        }
        const isFullWork = this.fullLayer === layer;
        if (isFullWork) {
            this.drawLayer?.getElementsByName(replaceId).forEach(c=>{
                this.drawLayer?.removeChild(c);
                c.disconnect();
            })
        } else {
            this.fullLayer.getElementsByName(replaceId).forEach(c=>{
                this.fullLayer.removeChild(c);
                c.disconnect();
            })
        }
    }
    static updateNodeOpt(param:{
        node: ShapeNodes,
        opt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        willSerializeData?: boolean,
        targetNode?: BaseNodeMapItem,
    }): IRectType | undefined {
        const {node, opt, vNodes, willSerializeData, targetNode} = param;
        const {zIndex, translate, angle, box, boxScale, boxTranslate, pointMap} = opt;
        let rect:IRectType|undefined;
        const nodeOpt = targetNode && cloneDeep(targetNode) || vNodes.get(node.name);
        if (!nodeOpt) return;
        if (isNumber(zIndex)) {
            node.setAttribute('zIndex',zIndex);
            nodeOpt.opt.zIndex = zIndex;
        }
        const layer = node.parent as Group;
        if(!layer) return;
        if (box && boxTranslate && boxScale) {
            const {rect} = nodeOpt;
            const oldPoints = [];
            for (let i = 0; i < nodeOpt.op.length; i+=3) {
                oldPoints.push(new Point2d(nodeOpt.op[i],nodeOpt.op[i+1],nodeOpt.op[i+2]));
            }
            const oldPointsRect = getRectFromPoints(oldPoints);
            const oldPointRectWH:[number,number]= [oldPointsRect.w * layer.worldScaling[0],oldPointsRect.h * layer.worldScaling[0]];
            const distance:[number,number] = [rect.w - oldPointRectWH[0], rect.h - oldPointRectWH[1]];
            const pointScale:[number,number] = [(rect.w * boxScale[0] - distance[0]) / oldPointRectWH[0], (rect.h * boxScale[1] - distance[1]) / oldPointRectWH[1]];
            const _boxTranslate:[number,number] = [boxTranslate[0] / layer.worldScaling[0], boxTranslate[1] / layer.worldScaling[1]];
            const op = nodeOpt.op.map((n,index)=> {
                const i = index % 3
                if (i === 0) {
                    return n + _boxTranslate[0];
                } 
                if( i === 1) {
                    return n + _boxTranslate[1];
                }
                return n
            })
            const newCenterPos:[number,number] = [nodeOpt.centerPos[0] + _boxTranslate[0],nodeOpt.centerPos[1]+ _boxTranslate[1]];
            scalePoints(op, newCenterPos, pointScale);
            // const newPoints = [];
            // for (let i = 0; i < op.length; i+=3) {
            //     newPoints.push(new Point2d(op[i],op[i+1],op[i+2]));
            // }
            if (checkOp(op)) {
                nodeOpt.op = op;
            }
            nodeOpt.centerPos = newCenterPos;
        } else if (translate) {
            node.setAttribute('translate', translate);
            nodeOpt.opt.translate = translate;
            if (targetNode) {
                const _translate:[number,number] = [translate[0] * layer.worldScaling[0], translate[1] * layer.worldScaling[1]];
                rect = getRectTranslated(nodeOpt.rect, _translate);
                nodeOpt.rect = rect;
            } else {
                const rect = BaseShapeTool.getRectFromLayer(layer, node.name);
                nodeOpt.rect = rect || nodeOpt.rect;
            }
        } 
        else if (isNumber(angle)) {
            node.setAttribute('rotate', angle)
            nodeOpt.opt.rotate = angle;
            if (targetNode) {
                rect = getRectRotated(nodeOpt.rect, angle);
                nodeOpt.rect = rect;
            } else {
                const rect = BaseShapeTool.getRectFromLayer(layer, node.name);
                nodeOpt.rect = rect || nodeOpt.rect;
            }
        }
        if (pointMap) {
            const op = pointMap.get(node.name);
            if (op) {
                for (let i = 0, j=0; i < nodeOpt.op.length; i+=3,j++) {
                    nodeOpt.op[i] = op[j][0];
                    nodeOpt.op[i+1] = op[j][1];
                }
            }
        }
        if (willSerializeData) {
            if (translate) {
                const _translate:[number,number] = [translate[0], translate[1]];
                const op = nodeOpt.op.map((n,index)=> {
                    const i = index % 3
                    if (i === 0) {
                        return n + _translate[0];
                    } 
                    if( i === 1) {
                        return n + _translate[1];
                    }
                    return n
                })
                nodeOpt.op = op;
                nodeOpt.centerPos = [nodeOpt.centerPos[0] + _translate[0], nodeOpt.centerPos[1] + _translate[1]];
                if (nodeOpt?.opt) {
                    nodeOpt.opt.translate = undefined;
                }
            } else if (isNumber(angle)) {
                const op = nodeOpt.op;
                rotatePoints(op, nodeOpt.centerPos, angle);
                nodeOpt.op = op;
                if (nodeOpt?.opt) {
                    nodeOpt.opt.rotate = undefined;
                }
            }
        }
        if (nodeOpt) {
            vNodes.setInfo(node.name, nodeOpt);
        }
    }
    static getCenterPos(r:IRectType, layer: Group):[number,number] {
        const {worldPosition, worldScaling} = layer;
        return [
            ((r.x + r.w / 2) - worldPosition[0]) / worldScaling[0],
            ((r.y + r.h / 2) - worldPosition[1]) / worldScaling[1]
        ]
    }
    static getRectFromLayer(layer: Group, name:string): IRectType|undefined {
        const node = layer.getElementsByName(name)[0] as ShapeNodes;
        if (node) {
            const r = node.getBoundingClientRect();
            return {
                x: Math.floor(r.x - BaseShapeTool.SafeBorderPadding),
                y: Math.floor(r.y - BaseShapeTool.SafeBorderPadding),
                w: Math.floor(r.width + BaseShapeTool.SafeBorderPadding * 2),
                h: Math.floor(r.height + BaseShapeTool.SafeBorderPadding * 2)
            }
        }
        return undefined
    }
}