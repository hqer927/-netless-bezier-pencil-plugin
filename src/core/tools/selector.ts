import { Path, Rect, Group, Layer, Scene } from "spritejs";
import { BaseShapeOptions, BaseShapeTool, BaseShapeToolProps } from "./base";
import { EDataType, EPostMessageType, EScaleType, EToolsKey, EvevtWorkState } from "../enum";
import { IWorkerMessage, IMainMessage, IRectType, IUpdateNodeOpt, IServiceWorkItem, BaseNodeMapItem } from "../types";
import { computRect, getRectFromPoints } from "../utils";
import { Point2d } from "../utils/primitives/Point2d";
import { Storage_Selector_key, Storage_Splitter } from "../../collector/const";
import type { VNodeManager } from "../vNodeManager";
import { ImageOptions, ImageShape, PolygonOptions, ShapeNodes, SpeechBalloonOptions, StarOptions, findShapeBody, getShapeTools } from ".";
import isNumber from "lodash/isNumber";
import { TextOptions } from "../../component/textEditor/types";
import { LocalWorkForFullWorker } from "../worker/fullWorkerLocal";
import isEqual from "lodash/isEqual";
import { ShapeOptType } from "../../displayer/types";
import type { SubLocalThread } from "../mainThread/subLocalThread";
import { TextShape } from "./text";
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
    vNodes:VNodeManager;
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
        this.vNodes = props.vNodes as VNodeManager;
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
        const group = new Group({
            pos: [drawRect.x, drawRect.y],
            anchor: [0, 0],
            size: [drawRect.w, drawRect.h],
            id: selectorId,
            name: selectorId,
            zIndex: 9999
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
        if(this.scaleType === EScaleType.both && this.selectIds?.length === 1){
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
    consume(props:{data: IWorkerMessage}) {
        const { op, workState }= props.data;
        let oldRect:IRectType|undefined = this.oldSelectRect;
        if (workState === EvevtWorkState.Start) {
            oldRect = this.unSelectedAllIds();
        }
        if (!op?.length || !this.vNodes.curNodeMap.size) {
            return { type: EPostMessageType.None}
        }
        this.updateTempPoints(op);
        const result = this.computSelector();
        if (this.selectIds && isEqual(this.selectIds, result.selectIds)) {
            return { type: EPostMessageType.None}
        }
        this.selectIds = result.selectIds;
        const rect: IRectType | undefined = result.intersectRect;
        this.getSelecteorInfo(result.subNodeMap);
        this.draw(SelectorShape.selectorId, this.fullLayer, result);
        this.oldSelectRect = rect;
        const points = this.getChildrenPoints();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect: computRect(rect, oldRect),
            selectIds: result.selectIds,
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
            shapeOpt:this.shapeOpt,
            ...this.baseConsumeResult
        }
    }
    consumeAll() {
        let rect:IRectType|undefined = this.oldSelectRect;
        if(!this.selectIds?.length && this.tmpPoints[0]){
            this.selectSingleTool(this.tmpPoints[0].XY,SelectorShape.selectorId, false);
        }
        if (this.selectIds?.length) {
            rect = this.selectedByIds(this.selectIds);
        }
        if (rect) {
            const points = this.getChildrenPoints();
            return {
                type: EPostMessageType.Select,
                dataType: EDataType.Local,
                rect: this.oldSelectRect,
                selectIds: this.selectIds,
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
                shapeOpt:this.shapeOpt,
                ...this.baseConsumeResult
            }
        }
        return { type: EPostMessageType.None }
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
    private selectSingleTool(point:[number,number], key:string = SelectorShape.selectorId, isService:boolean = false){
        if (point.length === 2) {
            const x = point[0];
            const y = point[1];
            let collision: BaseNodeMapItem | undefined;
            const {nodeRange}  = this.vNodes.getRectIntersectRange({x,y,w:0,h:0}, false);
            const InsertNodes = [...nodeRange.values()].sort((a,b)=> ((b.opt.zIndex || 0) - (a.opt.zIndex || 0)));
            for (const value of InsertNodes) {
                const nodes = this.fullLayer.getElementsByName(value.name) as ShapeNodes[];
                const bodys = findShapeBody(nodes);
                if (bodys.find(body => body.isPointCollision(x,y))) {
                    collision = value;
                    break;
                }
            }
            if (collision) {
                const name = collision.name;
                if (!isEqual(this.oldSelectRect, collision.rect)) {
                    const subNodeMap = new Map([[name, collision]]);
                    this.getSelecteorInfo(subNodeMap);
                    this.draw(key, this.fullLayer, {
                        intersectRect: collision.rect,
                        subNodeMap,
                        selectIds: this.selectIds || []
                    }, isService);
                }
                this.selectIds = [name];
                this.oldSelectRect = collision.rect;
             }
        }
    }
    private unSelectedAllIds(){
        let rect:IRectType | undefined;
        for (const [key,value] of this.vNodes.curNodeMap.entries()) {
            if (value.isSelected) {
                rect = computRect(rect, value.rect);
                this.vNodes.unSelected(key);
            }
        } 
        return rect;
    }
    private unSelectedByIds(unSelectedIs:string[]){
        let rect:IRectType | undefined;
        for (const id of unSelectedIs) {
            const value = this.vNodes.get(id);
            if (value && value.isSelected) {
                rect = computRect(rect, value.rect);
                this.vNodes.unSelected(id);
            }
        }
        return rect;
    }
    private selectedByIds(selectedIs:string[]){
        let rect:IRectType | undefined;
        for (const id of selectedIs) {
            const value = this.vNodes.get(id);
            if (value) {
                rect = computRect(rect, value.rect);
                this.vNodes.selected(id);
            }
        }
        return rect;
    }
    private getSelectorRect(layer:Group, selectorId: string) {
        let rect:IRectType | undefined;
        const selector = (layer.parent as Layer)?.getElementById(selectorId) as Group;
        const r = (selector as Group)?.getBoundingClientRect();
        if (r) {
            rect = computRect(rect, {
                x: Math.floor(r.x),
                y: Math.floor(r.y),
                w: Math.floor(r.width + 1),
                h: Math.floor(r.height + 1),
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
        worker?: LocalWorkForFullWorker | SubLocalThread,
        offset?:[number,number],
        scene?: Scene;
        isMainThread?:boolean;
    }): Promise<IMainMessage | undefined> {
        const {updateSelectorOpt, selectIds, vNodes, willSerializeData, worker, offset, scene, isMainThread} = param;
        const layer = this.fullLayer;
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
                            targetNode = targetNodes?.get(name);
                            if (targetNode && box) {
                                itemOpt.boxScale = scale;
                                const subCenter = [(targetNode.rect.x + targetNode.rect.w / 2), (targetNode.rect.y + targetNode.rect.h / 2)];
                                const oldDistance = [subCenter[0] - targetRectCenter[0], subCenter[1] - targetRectCenter[1]];
                                itemOpt.boxTranslate = [oldDistance[0] * (scale[0] - 1) + _translate[0] + (offset && offset[0] || 0), oldDistance[1] * (scale[1]-1) + _translate[1] + (offset && offset[1] || 0)];
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
                                    // itemOpt.angle || itemOpt.translate || itemOpt.boxScale ||
                                    (willSerializeData && (itemOpt.angle || itemOpt.translate)) ||
                                    (itemOpt.box && itemOpt.workState !== EvevtWorkState.Start) ||
                                    (itemOpt.pointMap && itemOpt.pointMap.has(name)) ||
                                    (toolsType === EToolsKey.Text && (itemOpt.fontSize || itemOpt.translate || (itemOpt.textInfos && itemOpt.textInfos.get(name)))) ||
                                    (toolsType === EToolsKey.Image && (itemOpt.angle || itemOpt.translate || itemOpt.boxScale)) || 
                                    (toolsType === itemOpt.toolsType && itemOpt.willRefresh)
                            )){
                                const workShape = worker.createWorkShapeNode({
                                    workId: name,
                                    toolsType,
                                    toolsOpt: info.opt
                                })
                                workShape?.setWorkId(name);
                                let r:IRectType|undefined;
                                if (toolsType === EToolsKey.Image && scene) {
                                    r = await (workShape as ImageShape).consumeServiceAsync({
                                        isFullWork: true,
                                        replaceId: name,
                                        scene,
                                        isMainThread
                                    })
                                } else if (toolsType === EToolsKey.Text) {
                                    r = await (workShape as TextShape).consumeServiceAsync({
                                        isFullWork: true,
                                        replaceId: name
                                    })
                                } else {
                                    try {
                                        r = workShape?.consumeService({
                                            op: info.op,
                                            isFullWork: true,
                                            replaceId: name
                                        }) 
                                    } catch (error) {
                                        continue;
                                    }
                                }
                                if (r) {
                                    info.rect = r;
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
            targetNodes = undefined;
        }
        const selectRect = intersectRect;
        if (targetBox && updateSelectorOpt.dir && selectRect && !offset) {
            const translate:[number,number] = [0,0];
            switch (updateSelectorOpt.dir) {
                case "top":{
                    const moveToBlockPoint = [targetBox.x, targetBox.y + targetBox.h];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;
                    } else {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h)                    }
                    break;
                }
                case "topLeft": {
                    const moveToBlockPoint = [targetBox.x + targetBox.w , targetBox.y + targetBox.h];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;
                    } else {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h);
                    }
                    if (updateSelectorOpt.reverseX) {
                        translate[0] = moveToBlockPoint[0] - selectRect.x;
                    } else {
                        translate[0] = moveToBlockPoint[0] - (selectRect.x + selectRect.w);   
                    }
                    break;
                }
                case "topRight": {
                    const moveToBlockPoint = [targetBox.x , targetBox.y + targetBox.h];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;
                    } else {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h);
                    }
                    if (updateSelectorOpt.reverseX) {
                        translate[0] = moveToBlockPoint[0] - (selectRect.x + selectRect.w);
                    } else {
                        translate[0] = moveToBlockPoint[0] - selectRect.x;     
                    }
                    break;
                }
                case "bottom":{
                    const moveToBlockPoint = [targetBox.x , targetBox.y];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h);
                    } else {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;    
                    }
                    break;               
                }
                case "bottomLeft": {
                    const moveToBlockPoint = [targetBox.x + targetBox.w , targetBox.y];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h);
                    } else {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;    
                    }
                    if (updateSelectorOpt.reverseX) {
                        translate[0] = moveToBlockPoint[0] - selectRect.x;
                    } else {
                        translate[0] = moveToBlockPoint[0] - (selectRect.x + selectRect.w);   
                    }
                    break;
                }
                case "bottomRight":{
                    const moveToBlockPoint = [targetBox.x, targetBox.y];
                    if (updateSelectorOpt.reverseY) {
                        translate[1] = moveToBlockPoint[1] - (selectRect.y + selectRect.h);
                    } else {
                        translate[1] = moveToBlockPoint[1] - selectRect.y;    
                    }
                    if (updateSelectorOpt.reverseX) {
                        translate[0] = moveToBlockPoint[0] - (selectRect.x + selectRect.w);
                    } else {
                        translate[0] = moveToBlockPoint[0] - selectRect.x;     
                    }
                    break;               
                }
                case "right":{
                    const moveToBlockPoint = [targetBox.x, targetBox.y];
                    if (updateSelectorOpt.reverseX) {
                        translate[0] = moveToBlockPoint[0] - (selectRect.x + selectRect.w);
                    } else {
                        translate[0] = moveToBlockPoint[0] - selectRect.x;     
                    }
                    break;
                } 
            }
            if (translate[0] || translate[1]) {
                selectRect.x = selectRect.x + translate[0];
                selectRect.y = selectRect.y + translate[1];
                return await this.updateSelector({...param, offset:translate});
            }
        }
        this.getSelecteorInfo(subNodeMap);
        this.draw(SelectorShape.selectorId, layer, {
            selectIds: selectIds || [],
            subNodeMap,
            intersectRect: selectRect
        });
        const rect = computRect(this.oldSelectRect, selectRect)
        this.oldSelectRect = selectRect;
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            selectRect,
            renderRect: intersectRect,
            rect: computRect(rect, selectRect),
            selectIds
        }
    }
    blurSelector(){
        const rect = this.unSelectedAllIds();
        return {
            type: EPostMessageType.Select,
            dataType: EDataType.Local,
            rect,
            selectIds: [],
            willSyncService: true,
        }
    }
    getRightServiceId(serviceWorkId:string) {
        return serviceWorkId.replace(Storage_Splitter,'-');
    }
    selectServiceNode(workId:string, workItem: Pick<IServiceWorkItem, 'selectIds'>, isService:boolean) {
        const {selectIds} = workItem;
        const rightWorkId = this.getRightServiceId(workId);
        const oldRect:IRectType | undefined = this.getSelectorRect(this.fullLayer, rightWorkId);

        let intersectRect:IRectType | undefined;
        const subNodeMap:Map<string,BaseNodeMapItem> = new Map();
        selectIds?.forEach(name => {
            const c = this.vNodes.get(name);
            if (c) {
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
        this.getSelecteorInfo(subNodeMap);
        this.draw(SelectorShape.selectorId, this.fullLayer, {
            intersectRect,
            subNodeMap,
            selectIds: this.selectIds || []
        });
        this.oldSelectRect = intersectRect;
        return intersectRect;
    }
    updateSelectIds(nextSelectIds:string[] ){
        let bgRect:IRectType|undefined;
        const unSelectedIds = this.selectIds?.filter(id=>!nextSelectIds.includes(id));
        if (unSelectedIds?.length) {
            bgRect = this.unSelectedByIds(unSelectedIds);
        }
        if (nextSelectIds.length) {
            const rect = this.selectedByIds(nextSelectIds);
            bgRect = computRect(bgRect, rect);
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
        this.selectIds = [];
        const key = this.workId?.toString();
        (this.fullLayer?.parent as Layer).children.forEach(c=>{
            if (c.name === key) {
                c.remove();
            }
        });
    }
}