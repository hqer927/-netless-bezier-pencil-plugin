import isNumber from "lodash/isNumber";
import { Storage_ViewId_ALL } from "../../collector/const";
import { EPostMessageType } from "../enum";
import { MasterControlForWorker } from "../mainEngine";
import { IBatchMainMessage, IWorkerMessage } from "../types";
import { IMainThreadInitOption, MainThreadEngineImpl } from "./base";
import { ViewContainerManager, type MainViewDisplayerManager } from "../../plugin/baseViewContainerManager";
import { SnapshotThreadImpl } from "./snapshotThread";

export interface MainThreadManager {
    master: MasterControlForWorker;
    mainThreadMap: Map<string, MainThreadEngineImpl>;
    createMainThread(viewId: string, opt: IMainThreadInitOption):MainThreadEngineImpl;
    consume(msg:Set<IWorkerMessage>):Promise<void>;
    post(sp:Omit<IBatchMainMessage,'render'>):void;
    destroy():void;
}

export class MainThreadManagerImpl implements MainThreadManager {
    mainThreadMap: Map<string, MainThreadEngineImpl> = new Map();
    private snapshotThread?:SnapshotThreadImpl;
    master: MasterControlForWorker;
    constructor(master: MasterControlForWorker) {
        this.master = master;
    }
    post(msg: Omit<IBatchMainMessage,'render'>): void {
        const {drawCount, sp, workerTasksqueueCount} = msg;
        if (this.master.isBusy && isNumber(workerTasksqueueCount)) {
            this.master.setWorkerTasksqueueCount(workerTasksqueueCount);
        }
        if (isNumber(drawCount)) {
            this.master.setMaxDrawCount(drawCount);
        }
        if (sp) {
            this.master.collectorSyncData(sp);
        }
    }
    destroy(): void {
        this.mainThreadMap.clear();
    }
    createMainThread(viewId: string, opt: IMainThreadInitOption) { 
        return new MainThreadEngineImpl(viewId, opt);
    }
    createSnapshotThread(viewId: string, opt: IMainThreadInitOption) { 
        return new SnapshotThreadImpl(viewId, opt);
    }
    async consume(msg:Set<IWorkerMessage>){
        for (const value of msg.values()) {
            const {msgType, viewId, tasksqueue, mainTasksqueueCount, layerOpt, offscreenCanvasOpt, cameraOpt} = value;
            if (msgType === EPostMessageType.Console) {
                console.log(this);
                continue;
            }
            if (msgType === EPostMessageType.Init) {
                const displayer = this.master.control.viewContainerManager.getView(viewId)?.displayer;
                const container = displayer?.canvasContainerRef.current;
                if (displayer && container && layerOpt && offscreenCanvasOpt) {
                    const mainThread = this.createMainThread(viewId, {
                        displayer,
                        container,
                        layerOpt,
                        master: this.master,
                        canvasOpt: offscreenCanvasOpt,
                        post:this.post.bind(this)
                    });
                    this.mainThreadMap.set(viewId, mainThread);
                    if (mainThread && cameraOpt) {
                        mainThread.setCameraOpt(cameraOpt);
                    }
                }
                continue;
            }
            if ((msgType === EPostMessageType.Snapshot || msgType === EPostMessageType.BoundingBox) && viewId === this.master.control.viewContainerManager.mainView?.id) {
                const displayer = this.master.control.viewContainerManager.getView(viewId)?.displayer;
                const container = (displayer as MainViewDisplayerManager).snapshotContainerRef?.current;
                if (displayer && container && cameraOpt) {
                    container.style.width = `${cameraOpt.width}px`;
                    container.style.height = `${cameraOpt.height}px`;
                    const layerOpt = {
                        ...ViewContainerManager.defaultLayerOpt,
                        offscreen: false,
                        width: cameraOpt.width,
                        height: cameraOpt.height
                    };
                    const canvasOpt = {
                        ...ViewContainerManager.defaultScreenCanvasOpt,
                        width: cameraOpt.width,
                        height: cameraOpt.height
                    }
                    this.snapshotThread = this.createSnapshotThread(viewId, {
                        displayer,
                        container,
                        layerOpt,
                        master:this.master,
                        canvasOpt,
                        post:this.post.bind(this)
                    });
                    this.snapshotThread.on(value).then(()=>{
                        this.snapshotThread = undefined;
                        container.innerHTML = '';
                        container.style.width = '';
                        container.style.height = '';
                    })
                    continue;
                }
            }
            if (msgType === EPostMessageType.TasksQueue && tasksqueue?.size) {
                for (const [viewId, workThread] of this.mainThreadMap.entries()) {
                    const task = tasksqueue.get(viewId);
                    if (task) {
                        await workThread.on(task);
                        if (mainTasksqueueCount) {
                            this.post({workerTasksqueueCount:mainTasksqueueCount});
                        }
                    }
                }
                continue;
            } 
            if (viewId === Storage_ViewId_ALL) {
                for (const workThread of this.mainThreadMap.values()) {
                    workThread.on(value);
                    if (msgType === EPostMessageType.Destroy) {
                        this.mainThreadMap.delete(viewId);
                    }
                }
                continue;
            }
            const workThread = this.mainThreadMap.get(viewId);
            if (!workThread) {
                continue;
            }
            workThread.on(value);
            if (msgType === EPostMessageType.Destroy) {
                this.mainThreadMap.delete(viewId);
            }
        }
    }
    
    
}