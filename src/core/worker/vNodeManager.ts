import { Group, Scene } from "spritejs";
import { BaseNodeMapItem, IRectType } from "../types";
import { computRect, isIntersect, isRenderNode } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import { getShapeTools } from "../tools/utils";
import { EToolsKey, EvevtWorkState } from "..";
import { ImageOptions } from "../tools";
import { TextOptions } from "../../component/textEditor";

export class VNodeManager {
    viewId:string;
    scene: Scene;
    scenePath?:string;
    drawLayer?: Group;
    fullLayer?: Group;
    curNodeMap: Map<string, BaseNodeMapItem> = new Map();
    targetNodeMap: Map<string, BaseNodeMapItem>[] = [];
    constructor(viewId:string, scene:Scene){
        this.viewId = viewId;
        this.scene = scene;
    }
    init(fullLayer: Group, drawLayer?: Group){
        this.fullLayer = fullLayer;
        this.drawLayer = drawLayer;
    }
    get(name:string){
        return this.curNodeMap.get(name);
    }
    hasRenderNodes(){
        let res = false;
        for (const node of this.curNodeMap.values()) {
            if (isRenderNode(node.toolsType)) res = true;
        }
        return res
    }
    has(name:string) {
        this.curNodeMap.has(name);
    }
    setInfo(name:string, info: Partial<BaseNodeMapItem> ) {
        const value: Partial<BaseNodeMapItem> = this.curNodeMap.get(name) || {
            name,
            rect: info.rect
        };
        if (info.rect) {
            value.rect = cloneDeep(info.rect);
        }
        if (info.op) {
            value.op = cloneDeep(info.op);
        }
        if (info.canRotate) {
            value.canRotate = info.canRotate;
        }
        if (info.scaleType) {
            value.scaleType = info.scaleType;
        }
        if (info.opt) {
            value.opt = cloneDeep(info.opt);
        }
        if (info.toolsType) {
            value.toolsType = info.toolsType;
        }
        if (info.centerPos) {
            value.centerPos = cloneDeep(info.centerPos);
        }
        if (value.rect) {
            this.curNodeMap.set(name, value as BaseNodeMapItem)
        } else {
            this.curNodeMap.delete(name);
        }
        // console.log('setInfo',name, value.opt?.workState,value.opt?.uid)
        // if(value.toolsType === EToolsKey.Text && (value.opt as TextOptions)?.workState === EvevtWorkState.Done){
        //     debugger;
        // }
    }
    delete(name:string){
        this.curNodeMap.delete(name);
    }
    clear(){
        this.curNodeMap.clear();
        this.targetNodeMap.length = 0;true
    }
    getRectIntersectRange(rect:IRectType, filterLock:boolean = true):{
        rectRange: IRectType | undefined,
        nodeRange: Map<string, BaseNodeMapItem>
    }{
        let rectRange:IRectType | undefined;
        const nodeRange: Map<string, BaseNodeMapItem> = new Map();
        for (const [key,v] of this.curNodeMap.entries()) {
            if (isIntersect(rect, v.rect)) {
                if(filterLock && v.toolsType === EToolsKey.Image && (v.opt as ImageOptions).locked){
                    continue;
                }
                if(filterLock && v.toolsType === EToolsKey.Text && ((v.opt as TextOptions).workState === EvevtWorkState.Doing || (v.opt as TextOptions).workState === EvevtWorkState.Start)) {
                    continue;
                }
                rectRange = computRect(rectRange, v.rect) as IRectType;
                nodeRange.set(key, v);
            }
        }
        return {
            rectRange,
            nodeRange
        }
    }
    getNodeRectFormShape(name:string, value: BaseNodeMapItem){
        const shape = getShapeTools(value.toolsType);
        let rect = this.fullLayer && shape?.getRectFromLayer(this.fullLayer, name);
        if (!rect && this.drawLayer) {
            rect = shape?.getRectFromLayer(this.drawLayer, name);
        }
        return rect;
    }
    updateNodesRect() {
        this.curNodeMap.forEach((value, key)=> {
            const rect = this.getNodeRectFormShape(key, value);
            if (!rect) {
                this.curNodeMap.delete(key);
            } else {
                value.rect = rect;
                // console.log('updateNodesRect1', cloneDeep(rect))
                this.curNodeMap.set(key, value);
            }
        })
        // console.log('updateNodesRect', cloneDeep(this.curNodeMap))
    }
    combineIntersectRect(rect:IRectType):IRectType{
        let _rect:IRectType = rect;
        this.curNodeMap.forEach(v => {
            if (isIntersect(_rect, v.rect)) {
                _rect = computRect(_rect, v.rect) as IRectType;
            }
        })
        return _rect;
    }
    setTarget():number {
        this.targetNodeMap.push(cloneDeep(this.curNodeMap))
        return this.targetNodeMap.length - 1;
    }
    getLastTarget() {
        return this.targetNodeMap[this.targetNodeMap.length - 1];
    }
    deleteLastTarget(){
        this.targetNodeMap.length = this.targetNodeMap.length - 1;
    }
    getTarget(i:number) {
        return this.targetNodeMap[i];
    }
    deleteTarget(i:number){
        this.targetNodeMap.length = i;
    }

}