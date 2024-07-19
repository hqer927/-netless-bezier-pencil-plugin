import { Layer, Scene } from "spritejs";
import { IMainMessage, IServiceWorkItem, IWorkerMessage } from "../types";
import { Storage_Selector_key, Storage_Splitter } from "../../collector/const";
import { transformToNormalData } from "../../collector/utils";
import type { BaseShapeOptions, ImageShape, SelectorShape } from "../tools";
import { getShapeInstance } from '../tools'
import { MainThreadEngineImpl, ISubThreadInitOption } from "./base";
import { VNodeManager } from "../vNodeManager";
import { EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { TextShape } from "../tools/text";
import { DefaultAppliancePluginOptions } from "../../plugin/const";

export interface SubServiceThread {
    workShapes: Map<string, IServiceWorkItem>;
    selectorWorkShapes: Map<string, IServiceWorkItem>;
    destroy():void;
    clearAll():void;
    consumeDraw(data: IWorkerMessage): void;
    runReverseSelectWork(selectIds: string[]):void;
    consumeFull(data: IWorkerMessage):void;
    removeWork(data:IWorkerMessage):void;
    runSelectWork(data: IWorkerMessage): void;
}
export class SubServiceThreadImpl implements SubServiceThread {
    readonly vNodes:VNodeManager;
    readonly thread: MainThreadEngineImpl;
    workShapes: Map<string, IServiceWorkItem> = new Map();
    selectorWorkShapes: Map<string, IServiceWorkItem> = new Map();
    private willRunEffectSelectorIds: Set<string> = new Set;
    private runEffectId?: number | undefined;
    private animationId?: number | undefined;
    private syncUnitTime: number = DefaultAppliancePluginOptions.syncOpt.interval;
    constructor(opt:ISubThreadInitOption){
        this.vNodes = opt.vNodes;
        this.thread = opt.thread;
    }
    destroy(){
        this.clearAll();
    }
    clearAll(): void {
        if (this.thread.serviceLayer.children.length) {
            (this.thread.serviceLayer.parent as Layer).children.forEach(c => {
                if (c.name !== 'viewport') {
                    c.remove();
                }
            });
            this.thread.serviceLayer.removeAllChildren();
        }
        this.workShapes.clear();
        this.selectorWorkShapes.clear();
        this.willRunEffectSelectorIds.clear();
    }
    private runEffect(){
        if (!this.runEffectId) {
            this.runEffectId = setTimeout(this.effectRunSelector.bind(this),0) as unknown as number;
        }
    }
    private effectRunSelector() {
        this.runEffectId = undefined;
        this.willRunEffectSelectorIds.forEach(id => {
            const workShape = this.selectorWorkShapes.get(id);
            workShape && workShape.selectIds && ( workShape.node as SelectorShape)?.selectServiceNode(id, workShape,true);
            if (!workShape?.selectIds?.length) {
                this.selectorWorkShapes.delete(id);
            }
        })
        this.willRunEffectSelectorIds.clear();
    }
    runSelectWork(data: IWorkerMessage): void {
        this.activeSelectorShape(data);
        const {workId} = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    removeWork(data: IWorkerMessage): void {
        const {workId} = data;
        const key = workId?.toString();
        if(key){
            const workShape = this.workShapes.get(key);
            if (workShape) {
                this.workShapes.delete(key);
                this.removeNode(key, data);
                return;
            }
            this.removeNode(key, data);
        }
    }
    consumeFull(data: IWorkerMessage): void {
        this.activeWorkShape(data);
        this.runAnimation();
    }
    runReverseSelectWork(selectIds: string[]){
        selectIds.forEach(id=>{
            this.selectorWorkShapes.forEach((workShapes,key)=>{
                if (workShapes.selectIds?.length) {
                    const i = workShapes.selectIds.indexOf(id);
                    if ( i > -1) {
                        workShapes.selectIds.splice(i,1);
                        this.willRunEffectSelectorIds.add(key);
                    }
                }
            })
        })
        if (this.willRunEffectSelectorIds.size) {
            this.runEffect();
        }
    }
    consumeDraw(data:IWorkerMessage){
        this.activeWorkShape(data);
        this.runAnimation();
    }

    private computNextAnimationIndex(workShape:IServiceWorkItem, pointUnit:number){
        const step = Math.floor((workShape.animationWorkData || []).slice(workShape.animationIndex).length * 32 / pointUnit / this.syncUnitTime) * pointUnit;
        return Math.min((workShape.animationIndex || 0) + (step || pointUnit), (workShape.animationWorkData||[]).length);
    }
    private async animationDraw() {
        this.animationId = undefined;
        let isNext:boolean = false;
        const cursorPoints: Map<string,{
            op:number[],
            workState:EvevtWorkState
        }>= new Map();

        for (const [key,workShape] of this.workShapes.entries()) {
            switch (workShape.toolsType) {
                case EToolsKey.Image: {
                        await (workShape.node as ImageShape)?.consumeServiceAsync({
                            isFullWork: true,
                            scene: (this.thread.fullLayer.parent?.parent) as Scene,
                            isMainThread: true
                        });
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.runEffect();
                            }
                        })
                        this.workShapes.delete(key)
                    break;
                }
                case EToolsKey.Text: {
                    if (workShape.node) {
                        await (workShape.node as TextShape)?.consumeServiceAsync({
                            isFullWork: true,
                            replaceId: key
                        });
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.runEffect();
                            }
                        })
                        workShape.node?.clearTmpPoints();
                        this.workShapes.delete(key);
                    }
                    break;
                }
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Rectangle:
                case EToolsKey.Ellipse:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                {
                    const isFullWork = !!workShape.ops;
                    if (workShape.animationWorkData?.length) {
                        const oldRect =  workShape.oldRect;
                        workShape.node?.consumeService({
                            op: workShape.animationWorkData, 
                            isFullWork
                        });
                        if (isFullWork) {
                            this.selectorWorkShapes.forEach((s,selectorId)=>{
                                if (s.selectIds?.includes(key)) {
                                    this.willRunEffectSelectorIds.add(selectorId);
                                    this.runEffect();
                                }
                            })
                            workShape.node?.clearTmpPoints();
                            this.workShapes.delete(key);
                        }
                        cursorPoints.set(key, {
                            workState: !oldRect? EvevtWorkState.Start : workShape.ops ? EvevtWorkState.Done : EvevtWorkState.Doing,
                            op: workShape.animationWorkData.filter((_v, i) => {
                                if (i % 3 !== 2) {
                                    return true;
                                }
                            }).slice(-2),
                        })
                        workShape.animationWorkData.length = 0;
                    }
                    break;
                }
                case EToolsKey.Pencil: {
                    if (!workShape.useAnimation && workShape.ops) {
                        workShape.node?.consumeService({
                            op: workShape.animationWorkData||[], 
                            isFullWork: true,
                            replaceId: key
                        });
                        workShape.node?.updataOptService(workShape.updateNodeOpt);
                        this.selectorWorkShapes.forEach((s,selectorId)=>{
                            if (s.selectIds?.includes(key)) {
                                this.willRunEffectSelectorIds.add(selectorId);
                                this.runEffect();
                            }
                        });
                        workShape.node?.clearTmpPoints();
                        this.workShapes.delete(key);
                    } else if(workShape.useAnimation){
                        if (workShape.isDel) {
                            workShape.node?.clearTmpPoints();
                            this.workShapes.delete(key);
                            break;
                        }
                        const pointUnit = 3;
                        const nextAnimationIndex = this.computNextAnimationIndex(workShape, pointUnit);
                        const lastPointIndex = !workShape.isDiff ? Math.max(0, (workShape.animationIndex || 0) - pointUnit) : 0;
                        const data = (workShape.animationWorkData || []).slice(lastPointIndex, nextAnimationIndex);
                        const workId = workShape.node?.getWorkId()?.toString();
                        if ((workShape.animationIndex || 0) < nextAnimationIndex || workShape.isDiff) {
                            workShape.node?.consumeService({
                                op: data,
                                isFullWork: false,
                            });
                            workShape.animationIndex = nextAnimationIndex;
                            if (workShape.isDiff) {
                                workShape.isDiff = false;
                            }
                            if (data.length) {
                                const cursorOp = data.filter((_v, i) => {
                                    if (i % pointUnit !== pointUnit - 1) {
                                        return true;
                                    }
                                }).slice(-2);
                                cursorPoints.set(key, {
                                    workState: lastPointIndex === 0 ? EvevtWorkState.Start : nextAnimationIndex === workShape.animationWorkData?.length ? EvevtWorkState.Done : EvevtWorkState.Doing,
                                    op: cursorOp,
                                });
                            }
                        } else if (workShape.ops) {
                            workShape.node?.consumeService({
                                op: workShape.animationWorkData || [],
                                isFullWork: true,
                                replaceId: workId
                            });
                            workShape.isDel = true;
                            cursorPoints.set(key, {
                                workState: EvevtWorkState.Done,
                                op: data.filter((_v, i) => {
                                    if (i % pointUnit !== pointUnit - 1) {
                                        return true;
                                    }
                                }).slice(-2),
                            })
                        }
                        isNext = true;
                        break;
                    }
                    break;
                }
                default:
                    break;
            }
        }
        if (isNext) {
            this.runAnimation();
        }
        if (cursorPoints.size) {
            const sp:Array<IMainMessage> = [];
            cursorPoints.forEach((v,k)=>{
                sp.push({
                    type: EPostMessageType.Cursor,
                    uid: k.split(Storage_Splitter)[0],
                    op: v.op,
                    workState: v.workState,
                    viewId: this.thread.viewId
                })
            })
            this.thread.post({sp});
        }
    }
    private runAnimation(){
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationDraw.bind(this));
        }
    }
    private hasDiffData(oldOp: number[], newOp:number[], toolsType:EToolsKey) {
        const oldLength = oldOp.length;
        if (newOp.length < oldLength) {
            return true;
        }
        switch (toolsType) {
            case EToolsKey.Pencil: {
                for (let i = 0; i < oldLength; i+=3) {
                    if (newOp[i] !== oldOp[i] || newOp[i+1] !== oldOp[i+1]) {
                        return true;
                    }
                }
                break;
            }   
            case EToolsKey.LaserPen:{
                for (let i = 0; i < oldLength; i+=2) {
                    if (newOp[i] !== oldOp[i] || newOp[i+1] !== oldOp[i+1]) {
                        return true;
                    }
                }
                break;
            }
        }
        return false;
    }
    private activeWorkShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, updateNodeOpt, ops, op, useAnimation } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        const oldRect = this.vNodes.get(key)?.rect;
        if (!this.workShapes?.has(key)) {
            let workItem = {
                toolsType,
                animationWorkData: op || [],
                animationIndex:0,
                type,
                updateNodeOpt,
                ops,
                useAnimation: typeof useAnimation !== 'undefined' ? useAnimation : 
                    typeof updateNodeOpt?.useAnimation !== 'undefined' ? updateNodeOpt?.useAnimation : true,
                oldRect,
                isDiff:false
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(key, workItem, toolsType, opt);
            }
            this.workShapes?.set(key, workItem);
        }
        const workShape = this.workShapes?.get(key) as IServiceWorkItem;
        if (type) {
            workShape.type = type;
        }
        if (ops) {
            workShape.animationWorkData = transformToNormalData(ops);
            workShape.ops = ops;
        }
        if (updateNodeOpt) {
            workShape.updateNodeOpt = updateNodeOpt;
        }
        if (op) {
            workShape.isDiff = this.hasDiffData(workShape.animationWorkData || [], op, workShape.toolsType);
            workShape.animationWorkData = op;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        if (oldRect) {
            workShape.oldRect = oldRect;
        }
        if (toolsType && opt) {
            if (opt.syncUnitTime) {
                this.syncUnitTime = opt.syncUnitTime;
            }
            if (workShape.toolsType !== toolsType && toolsType && opt) {
                this.setNodeKey(key, workShape, toolsType, opt)
            }
            if(workShape.node){
                workShape.node.setWorkOptions(opt);                
            }
        }
    }
    private removeNode(key: string, data:IWorkerMessage){
        if (key.indexOf(Storage_Selector_key) > -1) {
            this.removeSelectWork(data);
        }
        this.thread.fullLayer.getElementsByName(key).forEach(c=>{
            c.remove();
        })
        this.thread.serviceLayer.getElementsByName(key).forEach(c=>{
            c.remove();
        })
        this.vNodes.delete(key);
    }
    private removeSelectWork(data:IWorkerMessage):void{
        const {workId} = data;
        const workIdStr = workId?.toString();
        if (workIdStr) {
            this.activeSelectorShape(data);
            this.willRunEffectSelectorIds.add(workIdStr);
        }
        this.runEffect();
    }
    private activeSelectorShape(data: IWorkerMessage){
        const {workId, opt, toolsType, type, selectIds } = data;
        if (!workId) {
            return;
        }
        const key = workId.toString();
        if (!this.selectorWorkShapes?.has(key)) {
            let workItem = {
                toolsType,
                selectIds,
                type,
                opt,
            } as IServiceWorkItem;
            if (toolsType && opt) {
                workItem = this.setNodeKey(key, workItem, toolsType, opt);
            }
            this.selectorWorkShapes?.set(key, workItem);
        }
        const workShape = this.selectorWorkShapes?.get(key) as IServiceWorkItem;
        if (type) {
            workShape.type = type;
        }
        if (workShape.node && workShape.node.getWorkId() !== key) {
            workShape.node.setWorkId(key);
        }
        workShape.selectIds = selectIds || [];
    }
    private setNodeKey(workId:string, workShape: IServiceWorkItem ,tools:EToolsKey, opt: BaseShapeOptions) { 
        workShape.toolsType = tools;
        workShape.node = getShapeInstance({
            toolsType: tools,
            toolsOpt: opt,
            vNodes: this.vNodes,
            fullLayer: this.thread.fullLayer,
            drawLayer: this.thread.serviceLayer,
            workId
        }, this);
        return workShape;
    }
}