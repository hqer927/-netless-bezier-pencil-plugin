import { Group, Layer, Scene } from "spritejs";
import { ICanvasOptionType, IMainThreadInitOption } from "./base";
import { MasterControlForWorker } from "../mainEngine";
import { IActiveToolsDataType, IBatchMainMessage, ICameraOpt, ILayerOptionType, IMainMessage, IRectType, IWorkerMessage } from "../types";
import { EDataType, EPostMessageType, EToolsKey } from "../../plugin";
import isEqual from "lodash/isEqual";
import { transformToNormalData } from "../../collector/utils";
import type { BaseShapeTool } from "../tools/base";
import type { ImageShape } from "../tools/image";
import { getShapeInstance } from "../tools/utils";
import { computRect } from "../utils";
import { TextShape } from "../tools/text";
import { Main_View_Id } from "../const";

export class SnapshotThreadImpl{
    viewId: string;
    fullLayer: Group;
    master: MasterControlForWorker;
    private opt: IMainThreadInitOption
    private scene: Scene;
    private mainThreadPostId?: number | undefined;
    private combinePostMsg: Set<Omit<IBatchMainMessage,'render'>>=new Set();
    workShapes: Map<string, BaseShapeTool> = new Map();
    constructor(viewId:string, opt: IMainThreadInitOption) {
        this.viewId = viewId;
        this.opt = opt;
        this.scene = this.createScene({...opt.canvasOpt, container:opt.container});
        this.master = opt.master;
        this.fullLayer = this.createLayer('fullLayer', this.scene, {...opt.layerOpt, bufferSize: this.viewId === Main_View_Id ? 6000 : 3000});
    }
    post(msg: Omit<IBatchMainMessage,'render'>): void {
        this.combinePostMsg.add(msg)
        this.runBatchPostData()
    }
    async on(msg: IWorkerMessage): Promise<void> {
        const {msgType} = msg;
        switch (msgType) {
            case EPostMessageType.Snapshot:
                await this.getSnapshot(msg);
                this.destroy();
                return;
            case EPostMessageType.BoundingBox:
                await this.getBoundingRect(msg);
                this.destroy();
                return;
        }
    }
    createWorkShapeNode(opt: IActiveToolsDataType & {workId:string}) {
        return getShapeInstance({...opt, fullLayer:this.fullLayer, drawLayer:undefined});
    }
    setFullWork(data: Pick<IWorkerMessage, 'workId' | 'opt'| 'toolsType'>){
        const {workId, opt, toolsType} = data;
        if (workId && opt && toolsType) {
            const workIdStr = workId.toString();
            let curWorkShapes: BaseShapeTool | undefined;
            if (workId && this.workShapes.has(workIdStr)) {
                curWorkShapes = this.workShapes.get(workIdStr);
                curWorkShapes?.setWorkOptions(opt);
            } else {
                curWorkShapes = this.createWorkShapeNode({
                    toolsOpt: opt,
                    toolsType,
                    workId:workIdStr
                })
            }
            if (!curWorkShapes) {
                return;
            }
            this.workShapes.set(workIdStr, curWorkShapes);
            return curWorkShapes
        }
    }
    async runFullWork(data: IWorkerMessage): Promise<IRectType | undefined> {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            let rect:IRectType|undefined;
            let updataOptRect:IRectType|undefined;
            const replaceId = workShape.getWorkId()?.toString();
            if (workShape.toolsType === EToolsKey.Image) {
                rect = await (workShape as ImageShape).consumeServiceAsync({
                    isFullWork: true,
                    scene: this.fullLayer.parent?.parent as Scene,
                    isMainThread: true
                });
            } else if (workShape.toolsType === EToolsKey.Text) {
                rect = await (workShape as TextShape).consumeServiceAsync({
                    isFullWork: true,
                    replaceId,
                    isDrawLabel: true
                });
            } else {
                rect = workShape.consumeService({
                    op, 
                    isFullWork: true,
                    replaceId,
                });
                updataOptRect = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            }
            return computRect(rect, updataOptRect);
        }
    }
    private async getSnapshot(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt, w, h} = data;
        if (scenePath && scenes && cameraOpt) {
            this.setCameraOpt(cameraOpt);
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const {opt} = value;
                            const r = await this.runFullWork({
                                ...value,
                                opt,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId:this.viewId
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            let options:ImageBitmapOptions|undefined;
            if (w && h) {
                options = {
                    resizeWidth: w,
                    resizeHeight: h,
                }
            }
            await this.getSnapshotRender({scenePath,options})
        }
    }
    private getSceneRect():IRectType {
        const {width, height} = this.scene;
        return {
            x: 0,
            y: 0,
            w: Math.floor(width),
            h: Math.floor(height)
        }
    }
    private getRectImageBitmap(rect: IRectType, options?:ImageBitmapOptions): Promise<ImageBitmap>{
        const x = Math.floor(rect.x * this.opt.displayer.dpr);
        const y = Math.floor(rect.y * this.opt.displayer.dpr);
        const w = rect.w > 0 && Math.floor(rect.w * this.opt.displayer.dpr || 1) || 1;
        const h = rect.h > 0 && Math.floor(rect.h * this.opt.displayer.dpr || 1) || 1;
        return createImageBitmap((this.fullLayer.parent as Layer).canvas, x, y, w,  h, options)
    }
    private async getSnapshotRender(data:{
        scenePath:string,
        options?:ImageBitmapOptions,
    }){
        const {scenePath, options} = data;
        (this.fullLayer?.parent as Layer).render();
        const imageBitmap = await this.getRectImageBitmap(this.getSceneRect(), options);
        if(imageBitmap) {
            this.post({
                sp:[{
                    type: EPostMessageType.Snapshot,
                    scenePath,
                    imageBitmap,
                    viewId: this.viewId
                }]
            });
            this.fullLayer?.removeAllChildren();
        }
    }
    private async getBoundingRect(data:IWorkerMessage){
        const {scenePath, scenes, cameraOpt} = data;
        if (scenePath && scenes && cameraOpt) {
            this.setCameraOpt(cameraOpt);
            let rect:IRectType|undefined;
            for (const [key,value] of Object.entries(scenes)) {
                if (value?.type) {
                    switch (value?.type) {
                        case EPostMessageType.UpdateNode:
                        case EPostMessageType.FullWork: {
                            const r = await this.runFullWork({
                                ...value,
                                workId: key,
                                msgType: EPostMessageType.FullWork,
                                dataType: EDataType.Service,
                                viewId:this.viewId
                            });
                            rect = computRect(rect,r);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            if(rect){
                this.post({
                    sp:[{
                        type: EPostMessageType.BoundingBox,
                        scenePath,
                        rect
                    }]
                });
            }
        }
    }
    setCameraOpt(cameraOpt:ICameraOpt): void {
        const {scale, centerX, centerY, width, height} = cameraOpt;
        this.updateScene({width, height});
        this.fullLayer.setAttribute('scale', [scale, scale]);
        this.fullLayer.setAttribute('translate', [-centerX,-centerY]);
    }
    private runBatchPostData(){
        if (!this.mainThreadPostId) {
            this.mainThreadPostId = requestAnimationFrame(this.combinePost.bind(this));
        }
    }
    private combinePostData(): IBatchMainMessage{
        this.mainThreadPostId = undefined;
        const sp: Array<IMainMessage> = [];
        for (const value of this.combinePostMsg.values()) {
            if (value.sp?.length) {
                for (const newSpData of value.sp) {
                    let isSame = false
                    for (const spData of sp) {
                        if (isEqual(newSpData, spData)) {
                            isSame = true;
                            break;
                        }
                    }
                    if(!isSame) {
                        sp.push(newSpData);
                    }
                } 
            }
        }
        this.combinePostMsg.clear();
        return {
            sp
        }
    }
    combinePost() {
        const msg = this.combinePostData();
        const rsp = msg.sp?.filter(s => s.type !== EPostMessageType.None);
        if (rsp?.length) {
            msg.sp = rsp.map(p=>{
                if(!p.viewId){
                    return {...p, viewId:this.viewId}
                }
                return p;
            });
        } else {
            delete msg.sp;
        }
        if (msg?.drawCount || msg.sp?.length) {
            this.opt.post(msg);
        }
    }
    private createScene(opt:ICanvasOptionType) {
        return new Scene({
            displayRatio: this.opt.displayer.dpr, 
            depth: false,
            desynchronized: true,
            ...opt,
            autoRender: false
        });
    }
    private createLayer(name:string, scene:Scene, opt: ILayerOptionType) {
        const {width, height} = opt;
        const sy = `canvas-${name}`;
        const layer = scene.layer(sy, opt);
        const group = new Group({
            anchor:[0.5, 0.5],
            pos:[width * 0.5, height * 0.5],
            size:[width, height],
            name:'viewport',
            id: name,
        })
        layer.append(group);
        return group;
    }
    private updateScene(offscreenCanvasOpt:ICanvasOptionType) {
        this.scene.attr({...offscreenCanvasOpt});
        const { width, height } = offscreenCanvasOpt;
        this.scene.width = width;
        this.scene.height = height;
        this.updateLayer({width, height});
    }
    private updateLayer(layerOpt:ILayerOptionType) {
        const { width, height } = layerOpt;
        (this.fullLayer.parent as Layer).setAttribute('width', width);
        (this.fullLayer.parent as Layer).setAttribute('height', height);
        this.fullLayer.setAttribute('size',[width, height]);
        this.fullLayer.setAttribute('pos',[width * 0.5, height * 0.5]);
    }
    destroy(){
        this.fullLayer.remove();
        this.scene.remove();
    }
}
