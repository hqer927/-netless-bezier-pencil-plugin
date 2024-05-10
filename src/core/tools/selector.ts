import { Path, Rect, Group, Layer, Scene } from "spritejs";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt, IServiceWorkItem, BaseNodeMapItem } from "../types";
import { computRect, getRectFromPoints, isSameArray, isSealedGroup } from "../utils";
import { Point2d } from "../utils/primitives/Point2d";
import { Storage_Selector_key } from "../../collector/const";
import { VNodeManager } from "../worker/vNodeManager";
import { ImageOptions, ImageShape, PolygonOptions, ShapeNodes, SpeechBalloonOptions, StarOptions, findShapeBody, getShapeTools } from ".";
import isNumber from "lodash/isNumber";
import { TextOptions } from "../../component/textEditor/types";
import { LocalWorkForFullWorker } from "../worker/fullWorkerLocal";
import isEqual from "lodash/isEqual";
import { ShapeOptType } from "../../displayer/types";
export interface SelectorOptions extends BaseShapeOptions {
}
type ComputSelectorResult = {
    intersectRect?: IRectType;
    selectIds:string[];
    subNodeMap: Map<string, BaseNodeMapItem>;
}
export class SelectorShape extends BaseShapeTool {
    readonly toolsType: EToolsKey = EToolsKey.Selector;
    static selectorId = Storage_Selector_key;
    static selectorBorderId = 'selector-border';
    protected tmpPoints:Array<Point2d> = [];
    protected workOptions: BaseShapeOptions;
    selectIds?: string[];
    selectorColor?: string;
    strokeColor?: string;
    fillColor?: string;
    oldSelectRect?: IRectType;
    canRotate:boolean = false;
    canTextEdit:boolean = false;
    canLock:boolean = false;
    scaleType: EScaleType = EScaleType.all;
    toolsTypes?:EToolsKey[];
    shapeOpt?: ShapeOptType;
    textOpt?: TextOptions;
    isLocked?: boolean;
    constructor(props:BaseShapeToolProps) {
        super(props);
        this.workOptions = props.toolsOpt as BaseShapeOptions;
    }
    private computSelector(filterLock:boolean = true) {
        const interRect = getRectFromPoints(this.tmpPoints);
        if (interRect.w === 0 || interRect.h === 0) {
            return {
                selectIds: [],
                intersectRect: undefined,
                subNodeMap: new Map()
            }
        }
        const {rectRange, nodeRange}  = this.vNodes.getRectIntersectRange(interRect, filterLock)
        return {
            selectIds: [...nodeRange.keys()],
            intersectRect: rectRange,
            subNodeMap: nodeRange
        }
    }
    private updateTempPoints(globalPoints:number[]) {
        const length = this.tmpPoints.length;
        const gl = globalPoints.length;
        if (gl > 1) {
            const nPoint = new Point2d(globalPoints[gl-2] * this.fullLayer.worldScaling[0]  + this.fullLayer.worldPosition[0], globalPoints[gl-1] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[1]);
            if (length === 2 ) {
                this.tmpPoints.splice(1, 1, nPoint);
            } else {
                this.tmpPoints.push(nPoint);
            }
        }
    }
    private drawSelector(data:{ 
        drawRect: IRectType;
        subNodeMap: Map<string, BaseNodeMapItem>;
        layer: Group;
        selectorId?: string;
        isService: boolean;
    }){
        const {drawRect, subNodeMap, selectorId, layer, isService} = data; 
        // console.log('drawSelector', selectorId, isService)
        const group = new Group({
            pos: [drawRect.x, drawRect.y],
            anchor: [0, 0],
            size: [drawRect.w, drawRect.h],
            id: selectorId,
            name: selectorId,
            zIndex: 1000
        })
        const childrenNode:Path[] = []
        if (isService) {
            const rectNode = new Rect({
                normalize: true,
                pos:[drawRect.w / 2, drawRect.h / 2],
                lineWidth: 1,
                strokeColor: this.selectorColor || this.workOptions.strokeColor,
                width: drawRect.w,
                height: drawRect.h,
                name: SelectorShape.selectorBorderId
            })
            childrenNode.push(rectNode)
        }
        subNodeMap.forEach((item, key) => {
            const rectPos = [
                item.rect.x + item.rect.w / 2 - drawRect.x,
                item.rect.y + item.rect.h / 2 - drawRect.y,
            ];
            const subNode = new Rect({
                normalize: true,
                pos: rectPos,
                lineWidth: 1,
                strokeColor: subNodeMap.size > 1 ? this.selectorColor || this.workOptions.strokeColor : undefined,
                width: item.rect.w,
                height: item.rect.h,
                id:`selector-${key}`,
                name:`selector-${key}`
            });
            childrenNode.push(subNode)       
        })
        childrenNode && group.append(...childrenNode);
        (layer?.parent as Layer).appendChild(group);
    }
    private draw(selectorId:string, layer:Group, data:ComputSelectorResult, isService:boolean= false) {
        const {intersectRect, subNodeMap } = data;
        (layer.parent as Layer)?.getElementById(selectorId)?.remove();
        if (intersectRect) {
            this.drawSelector({
                drawRect: intersectRect, 
                subNodeMap, 
                selectorId,
                layer,
                isService
            })
        }
    }
    private getSelecteorInfo(subNodeMap: Map<string, BaseNodeMapItem>){
        this.scaleType = EScaleType.all;
        this.canRotate = false;
        this.textOpt = undefined;
        this.strokeColor = undefined;
        this.fillColor = undefined;
        this.canTextEdit = false;
        this.canLock = false;
        this.isLocked = false;
        this.toolsTypes = undefined;
        this.shapeOpt = undefined;
        const toolsTypes:Set<EToolsKey> = new Set();
        let image: BaseNodeMapItem | undefined;
        for (const item of subNodeMap.values()) {
            const {opt, canRotate, scaleType, toolsType}= item;
            this.selectorColor = this.workOptions.strokeColor;
            if (opt.strokeColor) {
                this.strokeColor = opt.strokeColor;
            }
            if (opt.fillColor) {
                this.fillColor = opt.fillColor;
            }
            if (opt.textOpt) {
                this.textOpt = opt.textOpt;
            }
            if (toolsType === EToolsKey.SpeechBalloon) {
                toolsTypes.add(toolsType);
                if (!this.shapeOpt) {
                    this.shapeOpt = {};
                }
                this.shapeOpt.placement = (opt as SpeechBalloonOptions).placement;
            }
            if (toolsType === EToolsKey.Polygon) {
                toolsTypes.add(toolsType);
                if (!this.shapeOpt) {
                    this.shapeOpt = {};
                }
                this.shapeOpt.vertices = (opt as PolygonOptions).vertices;
            }
            if (toolsType === EToolsKey.Star) {
                toolsTypes.add(toolsType);
                if (!this.shapeOpt) {
                    this.shapeOpt = {};
                }
                this.shapeOpt.vertices = (opt as StarOptions).vertices;
                this.shapeOpt.innerRatio = (opt as StarOptions).innerRatio;
                this.shapeOpt.innerVerticeStep = (opt as StarOptions).innerVerticeStep;
            }
            if (toolsType === EToolsKey.Text) {
                this.textOpt = opt as TextOptions;
            }
            if (subNodeMap.size === 1) {
                if (this.textOpt) {
                    this.canTextEdit = true;
                }
                this.canRotate = canRotate;
                this.scaleType = scaleType;
            } 
            if (scaleType === EScaleType.none) {
                this.scaleType = scaleType;
            }
            if (toolsType === EToolsKey.Image) {
                image = item;
            }
        }
        if(toolsTypes.size){
            this.toolsTypes = [...toolsTypes];
        }
        if (image) {
            if (subNodeMap.size === 1) {
                this.canLock = true;
                if ((image.opt as ImageOptions).locked) {
                    this.isLocked = true;
                    this.scaleType = EScaleType.none;
                    this.canRotate = false;
                    this.textOpt = undefined;
                    this.fillColor = undefined;
                    this.selectorColor = 'rgb(177,177,177)';
                    this.strokeColor = undefined;
                    this.canTextEdit = false;
                }
            }
            else if (subNodeMap.size > 1 && !(image.opt as ImageOptions).locked) {
                this.canLock = false;
                this.canRotate = false;
            }
        }
    }
    getChildrenPoints(){
        if(this.scaleType === EScaleType.both && this.selectIds){
            const chilrenId = this.selectIds[0];
            const op = this.vNodes.get(chilrenId)?.op;
            if (op) {
                const points:[number,number][] = [];
                for (let i = 0; i < op.length; i+=3) {
                    points.push([op[i],op[i+1]]);
                }
                return points;
            }
        }
    }
    consume(props:{data: IWorkerMessage}): IMainMessage {
        const { op, workState }= props.data;
        let oldRect:IRectType|undefined = this.oldSelectRect;
        if (workState === EvevtWorkState.Start) {
            oldRect = this.backToFullLayer();
        }
        if (!op?.length || !this.vNodes.curNodeMap.size) {
            return { type: EPostMessageType.None}
        }
        this.updateTempPoints(op);
        const result = this.computSelector();
        if (this.selectIds && isSameArray(this.selectIds, result.selectIds)) {
            return { type: EPostMessageType.None}
        }
        this.selectIds = result.selectIds;
        const rect: IRectType | undefined = result.intersectRect;
        this.getSelecteorInfo(result.subNodeMap);
        this.draw(SelectorShape.selectorId, this.drawLayer || this.fullLayer, result);
        this.oldSelectRect = rect;
        const points = this.getChildrenPoints();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect: computRect(rect, oldRect),
            selectIds: result.selectIds,
            opt: this.workOptions,
            selectRect: rect,
            selectorColor: this.selectorColor,
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            textOpt: this.textOpt,
            canTextEdit: this.canTextEdit,
            canRotate: this.canRotate,
            canLock:this.canLock,
            scaleType: this.scaleType,
            willSyncService: true,
            points,
            isLocked:this.isLocked,
            toolsTypes: this.toolsTypes,
            shapeOpt:this.shapeOpt
        }
    }
    consumeAll(props?:{hoverId?:string}): IMainMessage {
        if(!this.selectIds?.length && this.tmpPoints[0]){
            this.selectSingleTool(this.tmpPoints[0].XY,SelectorShape.selectorId, false, props?.hoverId);
        }
        if (this.selectIds?.length) {
            this.sealToDrawLayer(this.selectIds);
        }
        if (this.oldSelectRect) {
            const points = this.getChildrenPoints();
            // console.log('consumeAll---01', this.selectIds)
            return {
                type: EPostMessageType.Select,
                dataType: EDataType.Local,
                rect: this.oldSelectRect,
                selectIds: this.selectIds,
                opt: this.workOptions,
                selectorColor: this.selectorColor,
                selectRect:  this.oldSelectRect,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
                textOpt: this.textOpt,
                canTextEdit: this.canTextEdit,
                canRotate: this.canRotate,
                canLock: this.canLock,
                scaleType: this.scaleType,
                willSyncService: true,
                points,
                isLocked:this.isLocked,
                toolsTypes: this.toolsTypes,
                shapeOpt:this.shapeOpt
            }
        }
        return {
            type: EPostMessageType.None
        }
    }
    consumeService(): undefined {
        return ;
    }
    clearTmpPoints(): void {
        this.tmpPoints.length = 0;
    }
    clearSelectData(): void {
        this.selectIds = undefined;
        this.oldSelectRect = undefined;
    }
    private selectSingleTool(point:[number,number], key:string = SelectorShape.selectorId, isService:boolean = false, hoverId?:string){
        if (point.length === 2) {
            const x = point[0];
            const y = point[1];
            let collision:ShapeNodes | undefined;
            for (const node of this.fullLayer.children) {
                const bodys = findShapeBody([node]);
                let isCollision:boolean = false;
                const isOptimal:boolean = hoverId && hoverId === node.name || false;
                if (isOptimal && bodys.find(body=>body.isPointCollision(x,y))) {
                    collision = node as ShapeNodes;
                    break;
                }
                for (const body of bodys) {
                    isCollision = body.isPointCollision(x,y);
                    if (isCollision) {
                        if (!collision) {
                            collision = node as ShapeNodes;
                        } else {
                            const newNodeInfo = this.vNodes.get(node.name);
                            const oldNodeInfo = this.vNodes.get(collision.name);
                            if (newNodeInfo?.toolsType !== EToolsKey.Text && oldNodeInfo?.toolsType === EToolsKey.Text) {
                                break;
                            }
                            if (newNodeInfo?.toolsType === EToolsKey.Text && oldNodeInfo?.toolsType !== EToolsKey.Text) {
                                collision = node as ShapeNodes;
                            } else {
                                const newZIndex = newNodeInfo?.opt.zIndex || 0;
                                const oldZIndex = oldNodeInfo?.opt.zIndex || 0;
                                if (Number(newZIndex) >= Number(oldZIndex)) {
                                    collision = node as ShapeNodes;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            if (collision) {
               const name = collision.name;
               const v = this.vNodes.get(name);
                if (v) {
                    if (!isEqual(this.oldSelectRect, v.rect)) {
                        const subNodeMap = new Map([[name, v]]);
                        this.getSelecteorInfo(subNodeMap);
                        this.draw(key, this.drawLayer || this.fullLayer, {
                            intersectRect: v.rect,
                            subNodeMap,
                            selectIds: this.selectIds || []
                        }, isService);
                    }
                    this.selectIds = [name];
                    this.oldSelectRect = v.rect;
                }
            }
        }
    }
    private backToFullLayer(backToFullIds?:string[]): IRectType | undefined {
        let rect:IRectType | undefined;
        const cloneNodes:Array<ShapeNodes> = [];
        const removeNodes:Array<ShapeNodes> = [];
        // console.log('this.fullLayer-1', this.fullLayer.children.length, this.drawLayer?.children.length, backToFullIds)
        for (const c of this.drawLayer?.children || []) {
            if (backToFullIds?.length && !backToFullIds.includes(c.id) ) {
                continue;
            }
            if (c.id !== SelectorShape.selectorId) {
                const cloneP = c.cloneNode(true) as ShapeNodes;
                if (isSealedGroup(c)) {
                    (cloneP as Group).seal();
                }
                if (!this.fullLayer.getElementsByName(c.name).length) {
                    cloneNodes.push(cloneP);
                }
                removeNodes.push(c);
                const r = this.vNodes.get(c.name)?.rect
                if (r) {
                    rect = computRect(rect, r);
                }
            }
        }
        removeNodes.forEach(r=>r.remove());
        cloneNodes.length && this.fullLayer.append(...cloneNodes);
        // console.log('this.fullLayer', this.fullLayer.children.length, this.drawLayer?.children.length)
        return rect;
    }
    private sealToDrawLayer(sealToDrawIds:string[]) {
        const cloneNodes:Array<ShapeNodes> = [];
        const removeNodes:Array<ShapeNodes> = [];
        // console.log('this.drawLayer-1', this.drawLayer?.children.length, sealToDrawIds, this.fullLayer.children.length)
        sealToDrawIds.forEach(name => {
            this.fullLayer.getElementsByName(name.toString()).forEach(c=>{
                // console.log('this.drawLayer-2', c.tagName)
                const cloneP = c.cloneNode(true) as (ShapeNodes);
                if (isSealedGroup(c)) {
                    (cloneP as Group).seal();
                }
                if (!this.drawLayer?.getElementsByName(c.name).length) {
                    cloneNodes.push(cloneP);
                }
                removeNodes.push(c as Path)
            })
        });
        removeNodes.forEach(r=>r.remove());
        cloneNodes && this.drawLayer?.append(...cloneNodes);
        // console.log('this.drawLayer', this.drawLayer?.children.length, this.drawLayer?.children.length)
    }
    private getSelectorRect(layer:Group, selectorId: string) {
        let rect:IRectType | undefined;
        const selector = (layer.parent as Layer)?.getElementById(selectorId) as Group;
        // const box = selector?.getElementById(SelectorShape.selectorBorderId);
        const r = (selector as Group)?.getBoundingClientRect();
        if (r) {
            rect = computRect(rect, {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.round(r.width),
                h: Math.round(r.height),
            });
        }
        return rect;
    }
    isCanFillColor(toolsType?:EToolsKey) {
        if (toolsType === EToolsKey.Ellipse || toolsType === EToolsKey.Triangle ||
            toolsType === EToolsKey.Rectangle || toolsType === EToolsKey.Polygon || 
            toolsType === EToolsKey.Star || toolsType === EToolsKey.SpeechBalloon) {
                return true;
        }
        return false
    }
    async updateSelector(param:{
        updateSelectorOpt: IUpdateNodeOpt, 
        vNodes: VNodeManager,
        selectIds?: string[],
        willSerializeData?: boolean,
        worker?: LocalWorkForFullWorker,
        offset?:[number,number],
        scene?: Scene;
    }): Promise<IMainMessage | undefined> {
        const {updateSelectorOpt, selectIds, vNodes, willSerializeData, worker, offset, scene} = param;
        const layer = this.drawLayer;
        if (!layer) {
            return;
        }
        let intersectRect:IRectType | undefined;
        const subNodeMap:Map<string,BaseNodeMapItem> = new Map();
        const {box, workState, angle, translate} = updateSelectorOpt;
        let _translate:[number,number] = [0,0];
        let scale:[number,number] = [1,1];
        let targetRectCenter:[number,number] = [0,0];
        let targetNodes: Map<string, BaseNodeMapItem> | undefined;
        let targetBox:IRectType|undefined;
        if (box || translate || isNumber(angle)) {
            if (workState === EvevtWorkState.Start) {
                vNodes.setTarget();
                return {
                    type: EPostMessageType.Select,
                    dataType: EDataType.Local,
                    selectRect: this.oldSelectRect,
                    rect: this.oldSelectRect
                }
            }
            targetNodes = vNodes.getLastTarget();
            if (targetNodes && box) {
                let targetRect:IRectType | undefined;
                selectIds?.forEach((name:string)=>{
                    const targetNode = targetNodes?.get(name);
                    targetRect = computRect(targetRect, targetNode?.rect);
                })
                if (targetRect) {
                    scale = [box.w / targetRect.w, box.h / targetRect.h];
                    _translate = [(box.x + box.w / 2) - (targetRect.x + targetRect.w/2), (box.y + box.h / 2) - (targetRect.y + targetRect.h/2)];
                    targetRectCenter = [targetRect.x + targetRect.w / 2, targetRect.y + targetRect.h / 2];
                }
                targetBox = targetRect;
            }
        }
        if(selectIds){
            for (const name of selectIds) {
                const info = vNodes.get(name);
                if(info){
                    const {toolsType} = info
                    let node = (layer?.getElementsByName(name) as ShapeNodes[])[0];
                    if (node) {
                        const itemOpt: IUpdateNodeOpt = {...updateSelectorOpt};
                        let targetNode: BaseNodeMapItem | undefined;
                        if (toolsType) {
                            if (targetNodes) {
                                targetNode = targetNodes.get(name);
                                if (targetNode && box) {
                                    itemOpt.boxScale = scale;
                                    const subCenter = [(targetNode.rect.x + targetNode.rect.w / 2), (targetNode.rect.y + targetNode.rect.h / 2)];
                                    const oldDistance = [subCenter[0] - targetRectCenter[0], subCenter[1] - targetRectCenter[1]];
                                    itemOpt.boxTranslate = [oldDistance[0] * (scale[0] - 1) + _translate[0] + (offset && offset[0] || 0), oldDistance[1] * (scale[1]-1) + _translate[1] + (offset && offset[1] || 0)];
                                }
                            }
                            const shape = getShapeTools(toolsType)
                            shape?.updateNodeOpt({
                                node, 
                                opt: itemOpt, 
                                vNodes, 
                                willSerializeData,
                                targetNode,
                            })
                            if (info && worker && (
                                    (willSerializeData && (itemOpt.angle || itemOpt.translate)) ||
                                    (itemOpt.box && itemOpt.workState !== EvevtWorkState.Start) ||
                                    (itemOpt.pointMap && itemOpt.pointMap.has(name)) ||
                                    (toolsType === EToolsKey.Text && (itemOpt.fontSize || (itemOpt.textInfos && itemOpt.textInfos.get(name)))) ||
                                    (toolsType === EToolsKey.Image && (itemOpt.angle || itemOpt.translate || itemOpt.boxScale)) || 
                                    (toolsType === itemOpt.toolsType && itemOpt.willRefresh)
                            )){
                                const workShape = worker.createWorkShapeNode({
                                    toolsType,
                                    toolsOpt: info.opt
                                })
                                workShape?.setWorkId(name);
                                let r:IRectType|undefined;
                                if (toolsType === EToolsKey.Image && scene) {
                                    r = await (workShape as ImageShape).consumeServiceAsync({
                                        isFullWork: false,
                                        replaceId: name,
                                        scene
                                    })
                                } else {
                                    r = workShape?.consumeService({
                                        op: info.op,
                                        isFullWork: false,
                                        replaceId: name,
                                        isClearAll: false
                                    })
                                }
                                if (r) {
                                    info.rect = r;
                                    vNodes.setInfo(name, info);
                                }
                                node = (layer?.getElementsByName(name) as ShapeNodes[])[0];
                            }
                            if (info) {
                                subNodeMap.set(name,info);
                                intersectRect = computRect(intersectRect, info.rect);
                            }
                        }
                    }
                } 
            }
        }
        if (targetNodes && workState === EvevtWorkState.Done) {
            vNodes.deleteLastTarget();
        }
        const selectRect = intersectRect;
        if (targetBox && updateSelectorOpt.dir && selectRect) {
            let translate:[number,number] = [0,0];
            switch (updateSelectorOpt.dir) {
                case 'topLeft':
                case 'left':{
                    const moveToBlockPoint = [targetBox.x+targetBox.w,targetBox.y+targetBox.h];
                    translate = [moveToBlockPoint[0]-(selectRect.x+ selectRect.w),moveToBlockPoint[1]-(selectRect.y+selectRect.h)];
                    break;
                } 
                case 'bottomLeft':
                case 'bottom':{
                    const moveToBlockPoint = [targetBox.x+targetBox.w,targetBox.y];
                    translate = [moveToBlockPoint[0]-(selectRect.x+ selectRect.w),moveToBlockPoint[1]-(selectRect.y)];
                    break;
                }
                case 'topRight':
                case 'top':{
                    const moveToBlockPoint = [targetBox.x,targetBox.y+targetBox.h];
                    translate = [moveToBlockPoint[0]-(selectRect.x),moveToBlockPoint[1]-(selectRect.y+selectRect.h)];
                    break;
                }  
                case 'right':
                case 'bottomRight':{
                    const moveToBlockPoint = [targetBox.x,targetBox.y];
                    translate = [moveToBlockPoint[0]-selectRect.x,moveToBlockPoint[1]-selectRect.y];
                    break;
                } 
            }
            if (translate[0] || translate[1]) {
                selectRect.x = selectRect.x + translate[0];
                selectRect.y = selectRect.y + translate[1];
                // console.log('updateSelector---0---0--00--00', intersectRect, intersectRect && [intersectRect.x+intersectRect?.w,intersectRect.y+intersectRect.h], translate,
                // selectRect, selectRect && [selectRect.x+selectRect?.w,selectRect.y+selectRect.h])
                return await this.updateSelector({...param, offset:translate});
            }
        }
        this.getSelecteorInfo(subNodeMap);
        this.draw(SelectorShape.selectorId, layer, {
            selectIds: selectIds || [],
            subNodeMap,
            intersectRect: selectRect
        });
        const rect = computRect(this.oldSelectRect, intersectRect)
        this.oldSelectRect = intersectRect;
        // if (!this.oldSelectRect) {
        //     debugger;
        // }
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            selectRect,
            renderRect: intersectRect,
            rect:computRect(rect, selectRect)
        }
    }
    blurSelector(){
        const rect = this.backToFullLayer();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect,
            selectIds: [],
            willSyncService: true,
        }
    }
    private getRightServiceId(serviceWorkId:string) {
        return serviceWorkId.replace("++",'-');
    }
    selectServiceNode(workId:string, workItem: Pick<IServiceWorkItem, 'selectIds'>, isService:boolean) {
        const {selectIds} = workItem;
        const rightWorkId = this.getRightServiceId(workId);
        // console.log('selectServiceNode', rightWorkId)
        const oldRect:IRectType | undefined = this.getSelectorRect(this.fullLayer, rightWorkId);
        let intersectRect:IRectType | undefined;
        const subNodeMap:Map<string,BaseNodeMapItem> = new Map();
        selectIds?.forEach(name => {
            const c = this.vNodes.get(name);
            const f = this.fullLayer.getElementsByName(name)[0];
            if (c && f) {
                intersectRect = computRect(intersectRect, c.rect);
                subNodeMap.set(name,c);
            }
        })
        this.getSelecteorInfo(subNodeMap);
        this.draw(rightWorkId,this.fullLayer, {
            intersectRect,
            selectIds: selectIds || [],
            subNodeMap,
        }, isService)
        return computRect(intersectRect, oldRect);
    }
    reRenderSelector(){
        let intersectRect:IRectType | undefined;
        const subNodeMap:Map<string,BaseNodeMapItem> = new Map();
        this.selectIds?.forEach((name:string) => {
            const nodeMap = this.vNodes.get(name);
            if(nodeMap){
                intersectRect = computRect(intersectRect, nodeMap.rect);
                subNodeMap.set(name, nodeMap);
            }
        },this);
        // console.log('reRenderSelector', this.selectIds, subNodeMap)
        this.getSelecteorInfo(subNodeMap);
        this.draw(SelectorShape.selectorId, this.drawLayer || this.fullLayer, {
            intersectRect,
            subNodeMap,
            selectIds: this.selectIds || []
        });
        this.oldSelectRect = intersectRect;
        return intersectRect;
    }
    updateSelectIds(nextSelectIds:string[] ){
        let bgRect:IRectType|undefined;
        const backToFullIds = this.selectIds?.filter(id=>!nextSelectIds.includes(id));
        const sealToDrawIds = nextSelectIds.filter(id=>!this.selectIds?.includes(id));
        if (backToFullIds?.length) {
            bgRect = this.backToFullLayer(backToFullIds);
        }
        if (sealToDrawIds.length) {
            this.sealToDrawLayer(sealToDrawIds);
            for (const id of sealToDrawIds) {
                const r = this.vNodes.get(id)?.rect;
                if (r) {
                    bgRect = computRect(bgRect, r);
                }
            }
        }
        this.selectIds = nextSelectIds;
        const selectRect = this.reRenderSelector();
        return {
            bgRect,
            selectRect
        } 
    }
    cursorHover(point:[number,number]) {
        const rect = this.oldSelectRect;
        this.selectIds = [];
        const key = this.workId?.toString();
        const nPoint:[number,number] = [point[0] * this.fullLayer.worldScaling[0]  + this.fullLayer.worldPosition[0], point[1] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[1]];
        this.selectSingleTool(nPoint, key, true);
        if (this.oldSelectRect && !isEqual(rect, this.oldSelectRect)) {
            return {
                type: EPostMessageType.CursorHover,
                dataType: EDataType.Local,
                rect: computRect(rect, this.oldSelectRect),
                selectorColor: this.selectorColor,
                willSyncService: false,
            }
        }
        if (!this.selectIds?.length) {
            this.oldSelectRect = undefined;
        }
        if (rect && !this.oldSelectRect) {
            this.cursorBlur();
            return {
                type: EPostMessageType.CursorHover,
                dataType: EDataType.Local,
                rect: rect,
                selectorColor: this.selectorColor,
                willSyncService: false,
            }
        }
    }
    cursorBlur(){
        const key = this.workId?.toString();
        (this.fullLayer?.parent as Layer).children.forEach(c=>{
            if (c.name === key) {
                c.remove();
            }
        });
    }
}