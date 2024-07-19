import { Group, Scene } from "spritejs";
import { BaseNodeMapItem, IRectType } from "./types";
import { checkOp, computRect, isIntersect, isRenderNode } from "./utils";
import cloneDeep from "lodash/cloneDeep";
import { getShapeTools } from "./tools/utils";
import { EToolsKey, EvevtWorkState } from ".";
import { ImageOptions } from "./tools";
import { TextOptions } from "../component/textEditor";
import isBoolean from "lodash/isBoolean";

export class VNodeManager {
    viewId:string;
    scene: Scene;
    fullLayer?: Group;
    curNodeMap: Map<string, BaseNodeMapItem> = new Map();
    targetNodeMap: Map<string, BaseNodeMapItem>[] = [];
    private highLevelIds?: Set<string>;
    constructor(viewId:string, scene:Scene){
        this.viewId = viewId;
        this.scene = scene;
    }
    init(fullLayer: Group){
        this.fullLayer = fullLayer;
    }
    get(name:string){
        return this.curNodeMap.get(name);
    }
    getNodesByType(type:EToolsKey){
        const res = new Map<string, BaseNodeMapItem>();
        this.curNodeMap.forEach((v,k) => {
            if (v.toolsType === type) {
                res.set(k, v);
            }
        })
        return res;
    }
    hasRenderNodes(){
        let res = false;
        for (const node of this.curNodeMap.values()) {
            if (isRenderNode(node)) res = true;
        }
        return res
    }
    has(name:string) {
        return this.curNodeMap.has(name);
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
            const isNotWrong = checkOp(info.op);
            if(isNotWrong){
                value.op = cloneDeep(info.op);
            }
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
        if (isBoolean(info.isSelected)) {
            value.isSelected = info.isSelected;
        }
        if (value.rect) {
            this.curNodeMap.set(name, value as BaseNodeMapItem)
        } else {
            this.curNodeMap.delete(name);
        }
    }
    selected(name:string){
        this.setInfo(name, {isSelected:true});
    }
    unSelected(name:string){
        this.setInfo(name, {isSelected:false});
    }
    delete(name:string){
        this.curNodeMap.delete(name);
    }
    clear(){
        this.curNodeMap.clear();
        this.targetNodeMap.length = 0;
    }
    hasRectIntersectRange(rect:IRectType, filterLock:boolean = true):boolean {
        for (const v of this.curNodeMap.values()) {
            if (isIntersect(rect, v.rect)) {
                if(filterLock && v.toolsType === EToolsKey.Image && (v.opt as ImageOptions).locked){
                    continue;
                }
                if(filterLock && v.toolsType === EToolsKey.Text && ((v.opt as TextOptions).workState === EvevtWorkState.Doing || (v.opt as TextOptions).workState === EvevtWorkState.Start)) {
                    continue;
                }
                return true;
            }
        }
        return false;
    }
    getRectIntersectRange(rect:IRectType, filterLock:boolean = true, filterEditor: boolean = true):{
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
                if(filterEditor && v.toolsType === EToolsKey.Text && ((v.opt as TextOptions).workState === EvevtWorkState.Doing || (v.opt as TextOptions).workState === EvevtWorkState.Start)) {
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
        const rect = this.fullLayer && shape?.getRectFromLayer(this.fullLayer, name);
        return rect;
    }
    updateNodeRect(key:string) {
        const value = this.curNodeMap.get(key) as BaseNodeMapItem;
        if (value) {
            const rect = this.getNodeRectFormShape(key, value);
            if (!rect) {
                this.curNodeMap.delete(key);
                return;
            }
            value.rect = rect;
            this.curNodeMap.set(key, value);
        }
    }
    updateHighLevelNodesRect(highLevelIds:Set<string>) {
        this.highLevelIds = highLevelIds;
        for (const key of this.highLevelIds.keys()) {
            this.updateNodeRect(key);
        }
    }
    updateLowLevelNodesRect() {
        for (const key of this.curNodeMap.keys()) {
            if (!this.highLevelIds?.has(key)) {
                this.updateNodeRect(key);
            }
        }
    }
    clearHighLevelIds(){
        this.highLevelIds = undefined;
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
        if (this.targetNodeMap.length) {
            this.targetNodeMap.length = this.targetNodeMap.length - 1;
        } 
    }
    getTarget(i:number) {
        return this.targetNodeMap[i];
    }
    deleteTarget(i:number){
        this.targetNodeMap.length = i;
    }
    clearTarget(){
        this.targetNodeMap.length = 0;
    }
}