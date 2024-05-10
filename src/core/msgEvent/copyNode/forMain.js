import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { EDataType, EPostMessageType, EToolsKey, EvevtWorkState } from "../../enum";
// import cloneDeep from "lodash/cloneDeep";
import { transformToNormalData, transformToSerializableData } from "../../../collector/utils";
import { Storage_Selector_key } from "../../../collector";
import { ETextEditorType } from "../../../component/textEditor";
export class CopyNodeMethod extends BaseMsgMethod {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "emitEventType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: EmitEventType.CopyNode
        });
    }
    collect(data) {
        if (!this.serviceColloctor || !this.mainEngine) {
            return;
        }
        const { workIds, viewId } = data;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!view?.displayer) {
            return;
        }
        const scenePath = view.focusScenePath;
        // const keys = [...workIds];
        // const store = this.serviceColloctor?.storage;
        // const localMsgs: [IWorkerMessage,Partial<IWorkerMessage>][] = [];
        // const serviceMsgs: BaseCollectorReducerAction[] = [];
        // const random = Math.floor( Math.random() * 30 + 1);
        // let translate:[number,number] = [random, random];
        // const undoTickerId = Date.now();
        // this.mainEngine.internalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
        // while (keys.length) {
        //     const curKey = keys.pop();
        //     if (!curKey) {
        //         continue;
        //     }
        //     const curKeyStr = curKey.toString()
        //     const isLocalId:boolean = this.serviceColloctor.isLocalId(curKeyStr);
        //     const key = isLocalId ? this.serviceColloctor.transformKey(curKey) : curKeyStr;
        //     let localWorkId:string | undefined = curKeyStr ;
        //     if (!isLocalId && this.serviceColloctor.isOwn(localWorkId)) {
        //         localWorkId = this.serviceColloctor.getLocalId(localWorkId);
        //     }
        //     const curStore = cloneDeep(store[viewId][scenePath][key]);
        //     if (curStore && localWorkId === Storage_Selector_key) {
        //         if (curStore.selectIds) {
        //             const bgRect = view.displayer.canvasBgRef.current?.getBoundingClientRect();
        //             const floatBarRect = view.displayer?.floatBarCanvasRef.current?.getBoundingClientRect();
        //             const bgCenter:[number,number] | undefined = bgRect && [bgRect.x + bgRect.width/ 2, bgRect.y + bgRect.height/ 2];
        //             const floatBarCenter:[number,number] | undefined = floatBarRect && [floatBarRect.x + floatBarRect.width/ 2, floatBarRect.y + floatBarRect.height/ 2];
        //             const scale = view.cameraOpt?.scale || 1;
        //             translate = bgCenter && floatBarCenter && [(bgCenter[0] - floatBarCenter[0] + random) / scale, (bgCenter[1] - floatBarCenter[1] + random) / scale] || [ random / scale, random / scale];
        //             keys.push(...curStore.selectIds);
        //         }
        //         continue;
        //     }
        //     if (curStore && curStore.toolsType === EToolsKey.Text && curStore.opt && (curStore.opt as TextOptions).workState && (curStore.opt as TextOptions).workState !== EvevtWorkState.Done) {
        //         const cameraOpt = view.cameraOpt;
        //         const bgCenter:[number,number] | undefined = cameraOpt && [cameraOpt.centerX,cameraOpt.centerY];
        //         const opt = curStore.opt as TextOptions;
        //         const textCenter:[number,number] | undefined = opt.boxPoint && opt.boxSize && [opt.boxPoint[0] + opt.boxSize[0]/2, opt.boxPoint[1]+ opt.boxSize[1]/2];
        //         const scale = cameraOpt?.scale || 1;
        //         translate = bgCenter && textCenter && [bgCenter[0] - textCenter[0] + random, bgCenter[1] - textCenter[1] + random] || [ random / scale, random / scale];
        //     }
        //     if (curStore) {
        //         const now = Date.now();
        //         const copyNodeKey = (isLocalId ? curKey : this.serviceColloctor.getLocalId(curKey.toString())) + '-' + now;
        //         const updateNodeOpt:IUpdateNodeOpt = {useAnimation:false};
        //         if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
        //             const opt = curStore.opt as TextOptions;
        //             if ( opt && opt.boxPoint && opt.text) {
        //                 opt.workState = EvevtWorkState.Done;
        //                 const oldBoxPoint = opt.boxPoint;
        //                 opt.boxPoint = [oldBoxPoint[0] + translate[0], oldBoxPoint[1] + translate[1]];
        //                 opt.workState = EvevtWorkState.Done;
        //                 const point:[number,number] = this.control.viewContainerManager.transformToOriginPoint(opt.boxPoint, viewId);
        //                 this.control.textEditorManager.createTextForMasterController({
        //                     workId: copyNodeKey,
        //                     x: point[0],
        //                     y: point[1],
        //                     opt,
        //                     scale: view.cameraOpt?.scale || 1,
        //                     type: ETextEditorType.Text,
        //                     isActive: false,
        //                     viewId,
        //                     scenePath
        //                 });
        //             }
        //             continue;
        //         }
        //         if (curStore.toolsType === EToolsKey.Image) {
        //             (curStore.opt as ImageOptions).uuid = copyNodeKey;
        //             (curStore.opt as ImageOptions).centerX = (curStore.opt as ImageOptions).centerX + translate[0];
        //             (curStore.opt as ImageOptions).centerY = (curStore.opt as ImageOptions).centerY + translate[1];
        //             // continue;
        //         }
        //         if (curStore.ops) {
        //             const op = (transformToNormalData(curStore.ops) as number[]).map((n,index)=>{
        //                 const i = index % 3
        //                 if ( i === 0) {
        //                     return n + translate[0];
        //                 } 
        //                 if( i === 1) {
        //                     return n + translate[1];
        //                 }
        //                 return n
        //             })
        //             const newOps = transformToSerializableData(op);
        //             curStore.ops = newOps;
        //         }
        //         serviceMsgs.push({
        //             ...curStore,
        //             updateNodeOpt,
        //             type: EPostMessageType.FullWork,
        //             workId: copyNodeKey,
        //             viewId,
        //             scenePath
        //         })
        //         localMsgs.push([{
        //             ...curStore,
        //             updateNodeOpt,
        //             workId: copyNodeKey,
        //             msgType: EPostMessageType.FullWork,
        //             dataType: EDataType.Local,
        //             emitEventType: this.emitEventType,
        //             willSyncService: false,
        //             willRefresh: true,
        //             viewId,
        //             undoTickerId
        //         },{workId: copyNodeKey, msgType: EPostMessageType.FullWork, emitEventType: this.emitEventType}])
        //     }
        // }
        // if (localMsgs.length) {
        //     this.collectForLocalWorker(localMsgs);
        // }
        // if (serviceMsgs.length) {
        //     this.collectForServiceWorker(serviceMsgs);
        // }
        for (const id of workIds) {
            const curKeyStr = id.toString();
            const isLocalId = this.serviceColloctor.isLocalId(curKeyStr);
            const key = isLocalId ? this.serviceColloctor.transformKey(id) : curKeyStr;
            const curStore = this.serviceColloctor.getStorageData(viewId, scenePath)?.[key];
            if (curStore) {
                if (id === Storage_Selector_key) {
                    const pasteParam = curStore && this.copySelector({
                        viewId,
                        store: curStore
                    });
                    pasteParam && this.pasteSelector({
                        ...pasteParam,
                        viewId,
                        scenePath,
                    });
                    break;
                }
                if (curStore.toolsType === EToolsKey.Text && curStore.opt && curStore.opt.workState && curStore.opt.workState !== EvevtWorkState.Done) {
                    const pasteParam = curStore && this.copyText({
                        viewId,
                        store: curStore
                    });
                    pasteParam && this.pasteText({
                        ...pasteParam,
                        viewId,
                        scenePath,
                        key,
                        store: curStore
                    });
                    break;
                }
            }
        }
    }
    copyText(param) {
        const { viewId, store } = param;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!this.serviceColloctor || !view) {
            return;
        }
        const cameraOpt = view?.cameraOpt;
        const bgCenter = cameraOpt && [cameraOpt.centerX, cameraOpt.centerY];
        const opt = store.opt;
        const textCenter = opt.boxPoint && opt.boxSize && [opt.boxPoint[0] + opt.boxSize[0] / 2, opt.boxPoint[1] + opt.boxSize[1] / 2];
        return {
            bgCenter,
            textCenter
        };
    }
    pasteText(param) {
        const { bgCenter, textCenter, store, key, viewId, scenePath } = param;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!this.serviceColloctor || !view) {
            return;
        }
        const random = Math.floor(Math.random() * 30 + 1);
        const now = Date.now();
        const scale = view.cameraOpt?.scale || 1;
        const translate = bgCenter && textCenter && [bgCenter[0] - textCenter[0] + random, bgCenter[1] - textCenter[1] + random] || [random / scale, random / scale];
        const isLocalId = this.serviceColloctor.isLocalId(key);
        const copyNodeKey = (isLocalId ? key : this.serviceColloctor.getLocalId(key.toString())) + '-' + now;
        this.mainEngine.internalMsgEmitter.emit('undoTickerStart', now, viewId);
        if (store.toolsType === EToolsKey.Text && store.opt) {
            const opt = store.opt;
            if (opt && opt.boxPoint && opt.text) {
                opt.workState = EvevtWorkState.Done;
                const oldBoxPoint = opt.boxPoint;
                opt.boxPoint = [oldBoxPoint[0] + translate[0], oldBoxPoint[1] + translate[1]];
                opt.workState = EvevtWorkState.Done;
                const point = this.control.viewContainerManager.transformToOriginPoint(opt.boxPoint, viewId);
                this.control.textEditorManager.createTextForMasterController({
                    workId: copyNodeKey,
                    x: point[0],
                    y: point[1],
                    opt,
                    scale: view.cameraOpt?.scale || 1,
                    type: ETextEditorType.Text,
                    isActive: false,
                    viewId,
                    scenePath
                });
                this.collectForServiceWorker([{
                        ...store,
                        opt,
                        type: EPostMessageType.FullWork,
                        workId: copyNodeKey,
                        viewId,
                        scenePath,
                        undoTickerId: now
                    }]);
            }
        }
    }
    copySelector(param) {
        const { viewId, store } = param;
        const view = this.control.viewContainerManager.getView(viewId);
        const selectIds = store.selectIds;
        if (!this.serviceColloctor || !selectIds?.length || !view) {
            return;
        }
        const copyStores = new Map();
        const copyCoordInfo = {
            offset: {
                x: 0,
                y: 0
            },
            cameraOpt: {
                centerX: view.cameraOpt?.centerX || 0,
                centerY: view.cameraOpt?.centerY || 0,
                scale: view.cameraOpt?.scale || 1,
            }
        };
        const bgRect = view.displayer.canvasBgRef.current?.getBoundingClientRect();
        const floatBarRect = view.displayer?.floatBarCanvasRef.current?.getBoundingClientRect();
        const screenBgCenter = bgRect && [bgRect.x + bgRect.width / 2, bgRect.y + bgRect.height / 2];
        const screenFloatBarCenter = floatBarRect && [floatBarRect.x + floatBarRect.width / 2, floatBarRect.y + floatBarRect.height / 2];
        const bgCenter = screenBgCenter && view.viewData && view.viewData.convertToPointInWorld({ x: screenBgCenter[0], y: screenBgCenter[1] });
        const floatBarCenter = screenFloatBarCenter && view.viewData && view.viewData.convertToPointInWorld({ x: screenFloatBarCenter[0], y: screenFloatBarCenter[1] });
        if (bgCenter && floatBarCenter) {
            copyCoordInfo.offset = {
                x: bgCenter.x - floatBarCenter.x,
                y: bgCenter.y - floatBarCenter.y,
            };
            // console.log('translate---000', copyCoordInfo.offset, copyCoordInfo.cameraOpt)
        }
        for (const id of selectIds) {
            const curStore = this.serviceColloctor?.getStorageData(view.id, view.focusScenePath)?.[id];
            curStore && copyStores.set(id, curStore);
        }
        return {
            copyStores,
            copyCoordInfo
        };
    }
    pasteSelector(param) {
        const { copyStores, copyCoordInfo, viewId, scenePath } = param;
        const view = this.control.viewContainerManager.getView(viewId);
        if (!copyStores.size || !this.serviceColloctor || !view) {
            return;
        }
        const { offset, cameraOpt } = copyCoordInfo;
        const { scale } = cameraOpt;
        const random = Math.floor(Math.random() * 30 + 1);
        const translate = [(offset.x + random), (offset.y + random)] || [random / scale, random / scale];
        // console.log('translate', translate, random)
        const now = Date.now();
        const localMsgs = [];
        const serviceMsgs = [];
        this.mainEngine.internalMsgEmitter.emit('undoTickerStart', now, viewId);
        for (const [key, curStore] of copyStores.entries()) {
            const isLocalId = this.serviceColloctor.isLocalId(key);
            const copyNodeKey = (isLocalId ? key : this.serviceColloctor.getLocalId(key.toString())) + '-' + now;
            const updateNodeOpt = { useAnimation: false };
            if (curStore.toolsType === EToolsKey.Text && curStore.opt) {
                const opt = curStore.opt;
                if (opt && opt.boxPoint && opt.text) {
                    opt.workState = EvevtWorkState.Done;
                    const oldBoxPoint = opt.boxPoint;
                    opt.boxPoint = [oldBoxPoint[0] + translate[0], oldBoxPoint[1] + translate[1]];
                    opt.workState = EvevtWorkState.Done;
                    const point = this.control.viewContainerManager.transformToOriginPoint(opt.boxPoint, viewId);
                    this.control.textEditorManager.createTextForMasterController({
                        workId: copyNodeKey,
                        x: point[0],
                        y: point[1],
                        opt,
                        scale: view.cameraOpt?.scale || 1,
                        type: ETextEditorType.Text,
                        isActive: false,
                        viewId,
                        scenePath
                    });
                }
                serviceMsgs.push({
                    ...curStore,
                    opt,
                    type: EPostMessageType.FullWork,
                    workId: copyNodeKey,
                    viewId,
                    scenePath,
                    undoTickerId: now
                });
                continue;
            }
            if (curStore.toolsType === EToolsKey.Image) {
                curStore.opt.uuid = copyNodeKey;
                curStore.opt.centerX = curStore.opt.centerX + translate[0];
                curStore.opt.centerY = curStore.opt.centerY + translate[1];
            }
            if (curStore.ops) {
                const op = transformToNormalData(curStore.ops).map((n, index) => {
                    const i = index % 3;
                    if (i === 0) {
                        return n + translate[0];
                    }
                    if (i === 1) {
                        return n + translate[1];
                    }
                    return n;
                });
                const newOps = transformToSerializableData(op);
                curStore.ops = newOps;
            }
            serviceMsgs.push({
                ...curStore,
                updateNodeOpt,
                type: EPostMessageType.FullWork,
                workId: copyNodeKey,
                viewId,
                scenePath,
                undoTickerId: now
            });
            localMsgs.push([{
                    ...curStore,
                    updateNodeOpt,
                    workId: copyNodeKey,
                    msgType: EPostMessageType.FullWork,
                    dataType: EDataType.Local,
                    emitEventType: EmitEventType.CopyNode,
                    willSyncService: false,
                    willRefresh: true,
                    viewId,
                    undoTickerId: now
                }, { workId: copyNodeKey, msgType: EPostMessageType.FullWork, emitEventType: EmitEventType.CopyNode }]);
        }
        if (localMsgs.length) {
            this.collectForLocalWorker(localMsgs);
        }
        if (serviceMsgs.length) {
            this.collectForServiceWorker(serviceMsgs);
        }
    }
}
