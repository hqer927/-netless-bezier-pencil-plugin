import throttle from "lodash/throttle";
import { ECanvasShowType, EPostMessageType, EToolsKey, EvevtWorkState, Cursor_Hover_Id } from "..";
import { EraserShape, SelectorShape } from "../tools";
import { LocalWork } from "./base";
import { computRect, getSafetyRect, isIntersectForPoint } from "../utils";
import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { EmitEventType } from "../../plugin/types";
// import cloneDeep from "lodash/cloneDeep";
export class LocalWorkForFullWorker extends LocalWork {
    constructor(opt) {
        super(opt);
        Object.defineProperty(this, "combineUnitTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 600
        });
        Object.defineProperty(this, "combineTimerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "effectSelectNodeData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "batchEraserWorks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "batchEraserRemoveNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "batchEffectWork", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((callBack) => {
                if (this.vNodes.curNodeMap.size) {
                    this.vNodes.updateNodesRect();
                    this.reRenderSelector();
                }
                callBack && callBack();
            }, 100, { 'leading': false })
        });
        Object.defineProperty(this, "batchEraserCombine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle(() => {
                const render = this.updateBatchEraserCombineNode(this.batchEraserWorks, this.batchEraserRemoveNodes);
                // console.log('throttle', this.batchEraserWorks.keys(), this.batchEraserRemoveNodes.keys(), this.curNodeMap.keys());
                this.batchEraserWorks.clear();
                this.batchEraserRemoveNodes.clear();
                if (render.length) {
                    // console.log('_post', this.fullLayer.children.map(c=>c.name))
                    this._post({
                        render
                    });
                }
            }, 100, { 'leading': false })
        });
    }
    consumeDraw(data, serviceWork) {
        const { op, workId } = data;
        if (op?.length && workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            const result = workShapeNode.consume({
                data,
                isFullWork: true
            });
            switch (toolsType) {
                case EToolsKey.Selector:
                    if (result.type === EPostMessageType.Select) {
                        result.selectIds && serviceWork.runReverseSelectWork(result.selectIds);
                        this.drawSelector(result, true);
                    }
                    break;
                case EToolsKey.Eraser:
                    if (result?.rect) {
                        this.drawEraser(result);
                    }
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                    if (result) {
                        this.drawCount++;
                        this.drawPencil(result);
                    }
                    break;
                case EToolsKey.Pencil:
                    if (!this.combineTimerId) {
                        this.combineTimerId = setTimeout(() => {
                            this.combineTimerId = undefined;
                            this.drawPencilCombine(workId);
                        }, Math.floor(workShapeNode.getWorkOptions().syncUnitTime || this.combineUnitTime / 2));
                    }
                    if (result) {
                        this.drawCount++;
                        this.drawPencil(result);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    consumeDrawAll(data, serviceWork) {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const { workId, undoTickerId } = data;
        if (workId) {
            if (undoTickerId) {
                setTimeout(() => {
                    this._post({
                        sp: [{
                                type: EPostMessageType.None,
                                undoTickerId,
                            }]
                    });
                }, 0);
            }
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            const hoverShapeNode = this.workShapes.get(Cursor_Hover_Id);
            const hoverId = hoverShapeNode?.selectIds?.[0];
            const r = workShapeNode.consumeAll({ data, hoverId });
            const workShapeState = this.workShapeState.get(workId);
            switch (toolsType) {
                case EToolsKey.Selector:
                    if (r.selectIds && hoverId && r.selectIds?.includes(hoverId)) {
                        hoverShapeNode.cursorBlur();
                    }
                    r.selectIds && serviceWork.runReverseSelectWork(r.selectIds);
                    this.drawSelector(r, false);
                    if (!workShapeNode.selectIds?.length) {
                        this.clearWorkShapeNodeCache(workId);
                    }
                    else {
                        workShapeNode.clearTmpPoints();
                    }
                    break;
                case EToolsKey.Eraser:
                    if (r?.rect) {
                        this.drawEraser(r);
                    }
                    workShapeNode.clearTmpPoints();
                    break;
                case EToolsKey.Arrow:
                case EToolsKey.Straight:
                case EToolsKey.Ellipse:
                case EToolsKey.Rectangle:
                case EToolsKey.Star:
                case EToolsKey.Polygon:
                case EToolsKey.SpeechBalloon:
                    this.drawPencilFull(r, workShapeNode.getWorkOptions(), workShapeState);
                    this.drawCount = 0;
                    this.clearWorkShapeNodeCache(workId);
                    break;
                case EToolsKey.Pencil:
                    if (r?.rect) {
                        this.drawPencilFull(r, workShapeNode.getWorkOptions(), workShapeState);
                        this.drawCount = 0;
                    }
                    this.clearWorkShapeNodeCache(workId);
                    break;
                default:
                    break;
            }
        }
    }
    async consumeFull(data, scene) {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        const workIdStr = data.workId?.toString();
        if (!workIdStr) {
            return;
        }
        if (workShape) {
            const oldRect = this.vNodes.get(workIdStr)?.rect;
            let rect;
            if (workShape.toolsType === EToolsKey.Image && scene) {
                rect = await workShape.consumeServiceAsync({
                    scene,
                    isFullWork: true,
                    replaceId: workIdStr,
                });
            }
            else {
                // console.log('consumeFull---1---0', data)
                rect = workShape.consumeService({
                    op,
                    isFullWork: true,
                    replaceId: workIdStr,
                });
                // console.log('consumeFull---1---0---0', rect)
            }
            const rect1 = data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
            rect = computRect(rect, rect1);
            const render = [];
            const sp = [];
            if (rect && data.willRefresh) {
                if (oldRect) {
                    render.push({
                        rect,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                        viewId: this.viewId
                    });
                }
                render.push({
                    rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId: this.viewId
                });
            }
            if (data.willSyncService) {
                sp.push({
                    opt: data.opt,
                    toolsType: data.toolsType,
                    type: EPostMessageType.FullWork,
                    workId: data.workId,
                    ops: data.ops,
                    updateNodeOpt: data.updateNodeOpt,
                    undoTickerId: data.undoTickerId,
                    viewId: this.viewId
                });
            }
            if (render.length || sp.length) {
                const _postData = { render, sp };
                // console.log('consumeFull---1', _postData)
                this._post(_postData);
            }
            data.workId && this.workShapes.delete(data.workId);
        }
    }
    removeWork(data) {
        const { workId } = data;
        const key = workId?.toString();
        if (key) {
            const rect = this.removeNode(key);
            if (rect) {
                this._post({
                    render: [{
                            rect,
                            isClear: true,
                            isFullWork: true,
                            clearCanvas: ECanvasShowType.Bg,
                            drawCanvas: ECanvasShowType.Bg,
                            viewId: this.viewId
                        }]
                });
            }
        }
    }
    removeNode(key) {
        this.workShapes.has(key) && this.clearWorkShapeNodeCache(key);
        let rect;
        const nodeMapItem = this.vNodes.get(key);
        if (nodeMapItem) {
            this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key) || []).forEach(node => {
                node.remove();
            });
            rect = computRect(rect, nodeMapItem.rect);
            this.vNodes.delete(key);
        }
        return rect;
    }
    async checkTextActive(data) {
        const { op, viewId, dataType } = data;
        if (op?.length) {
            let activeId;
            for (const value of this.vNodes.curNodeMap.values()) {
                const { rect, name, toolsType, opt } = value;
                console.log('checkTextActive', name, opt);
                const x = op[0] * this.fullLayer.worldScaling[0] + this.fullLayer.worldPosition[0];
                const y = op[1] * this.fullLayer.worldScaling[1] + this.fullLayer.worldPosition[1];
                if (toolsType === EToolsKey.Text && isIntersectForPoint([x, y], rect) && opt.workState === EvevtWorkState.Done) {
                    activeId = name;
                    break;
                }
            }
            if (activeId) {
                await this.blurSelector({
                    viewId,
                    msgType: EPostMessageType.Select,
                    dataType,
                    isSync: true
                });
                console.log('GetTextActive---0001');
                await this._post({
                    sp: [{
                            type: EPostMessageType.GetTextActive,
                            toolsType: EToolsKey.Text,
                            workId: activeId
                        }]
                });
            }
        }
    }
    async colloctEffectSelectWork(data) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        const { workId, msgType } = data;
        if (workShapeNode && workId && workShapeNode.selectIds && workShapeNode.selectIds.includes(workId.toString())) {
            if (msgType === EPostMessageType.RemoveNode) {
                workShapeNode.selectIds = workShapeNode.selectIds.filter(id => id !== workId.toString());
            }
            else {
                this.effectSelectNodeData.add(data);
            }
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 0);
            });
            await this.runEffectSelectWork(true).then(() => {
                this.effectSelectNodeData?.clear();
            });
            return undefined;
        }
        return data;
    }
    async updateSelector(params) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode?.selectIds?.length)
            return;
        const { callback, ...param } = params;
        const { updateSelectorOpt, willRefreshSelector, willSerializeData, emitEventType, scene } = param;
        const workState = updateSelectorOpt.workState;
        // console.log('updateSelector', updateSelectorOpt, this.viewId)
        const res = await workShapeNode?.updateSelector({
            updateSelectorOpt,
            selectIds: workShapeNode.selectIds,
            vNodes: this.vNodes,
            willSerializeData,
            worker: this,
            scene
        });
        const selectRect = res?.selectRect;
        const newServiceStore = new Map();
        workShapeNode.selectIds.forEach(id => {
            const info = this.vNodes.get(id);
            if (info) {
                const { toolsType, op, opt } = info;
                // console.log('newServiceStore', opt.translate, opt.scale, opt.rotate)
                newServiceStore.set(id, {
                    opt,
                    toolsType,
                    ops: op?.length && transformToSerializableData(op) || undefined
                });
            }
        });
        const render = [];
        const sp = [];
        if (willRefreshSelector) {
            render.push({
                isClearAll: true,
                isFullWork: false,
                clearCanvas: ECanvasShowType.Selector,
                viewId: this.viewId,
            });
            const reRenderSelectorDate = {
                rect: selectRect,
                isFullWork: false,
                drawCanvas: ECanvasShowType.Selector,
                viewId: this.viewId,
            };
            if (updateSelectorOpt.translate && emitEventType === EmitEventType.TranslateNode && workState === EvevtWorkState.Doing) {
                reRenderSelectorDate.translate = updateSelectorOpt.translate;
            }
            render.push(reRenderSelectorDate);
        }
        const _postData = callback && callback({
            res,
            workShapeNode,
            param,
            postData: { render, sp },
            newServiceStore
        }) || { render, sp };
        if (_postData.render.length || _postData.sp.length) {
            // console.log('updateSelector---0---0', _postData.render, _postData.sp)
            this._post(_postData);
        }
    }
    async blurSelector(data) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        const res = workShapeNode?.blurSelector();
        this.clearWorkShapeNodeCache(SelectorShape.selectorId);
        (this.drawLayer?.parent).children.forEach(c => {
            if (c.name === SelectorShape.selectorId) {
                c.remove();
            }
        });
        if (res) {
            const sp = [];
            sp.push({
                ...res,
                undoTickerId: data?.undoTickerId,
                isSync: data?.isSync
            });
            // console.log('GetTextActive---0002')
            await this._post({
                render: res?.rect && [{
                        rect: res.rect,
                        drawCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                        viewId: this.viewId
                    }],
                sp
            });
        }
    }
    runEffectWork(callBack) {
        this.batchEffectWork(callBack);
    }
    reRenderSelector(willSyncService = false) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode)
            return;
        if (workShapeNode && !workShapeNode.selectIds?.length) {
            return this.blurSelector();
        }
        if (this.drawLayer) {
            const newRect = workShapeNode.reRenderSelector();
            if (newRect) {
                this._post({
                    render: [
                        {
                            rect: newRect,
                            isClear: true,
                            isFullWork: false,
                            clearCanvas: ECanvasShowType.Selector,
                            drawCanvas: ECanvasShowType.Selector,
                            viewId: this.viewId
                        }
                    ],
                    sp: [{
                            type: EPostMessageType.Select,
                            selectIds: workShapeNode.selectIds,
                            selectRect: newRect,
                            willSyncService,
                            viewId: this.viewId,
                            points: workShapeNode.getChildrenPoints(),
                            textOpt: workShapeNode.textOpt,
                        }]
                });
            }
        }
    }
    updateFullSelectWork(data) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        const { selectIds } = data;
        if (!selectIds?.length) {
            this.blurSelector(data);
            return;
        }
        if (!workShapeNode) {
            this.setFullWork(data);
            this.updateFullSelectWork(data);
            return;
        }
        if (workShapeNode && selectIds?.length) {
            const { bgRect, selectRect } = workShapeNode.updateSelectIds(selectIds);
            console.log('updateFullSelectWork', selectIds, bgRect, selectRect, (this.drawLayer?.parent).children.map(c => c.name));
            const _postData = {
                render: [],
                sp: []
            };
            if (bgRect) {
                _postData.render?.push({
                    rect: getSafetyRect(bgRect),
                    isClear: true,
                    isFullWork: true,
                    clearCanvas: ECanvasShowType.Bg,
                    drawCanvas: ECanvasShowType.Bg,
                    viewId: this.viewId
                });
            }
            _postData.render?.push({
                rect: selectRect,
                isClear: true,
                isFullWork: false,
                clearCanvas: ECanvasShowType.Selector,
                drawCanvas: ECanvasShowType.Selector,
                viewId: this.viewId
            });
            _postData.sp?.push({
                ...data,
                selectorColor: data.opt?.strokeColor,
                strokeColor: data.opt?.strokeColor,
                fillColor: data.opt?.fillColor,
                textOpt: data.opt?.textOpt,
                canTextEdit: workShapeNode.canTextEdit,
                canRotate: workShapeNode.canRotate,
                scaleType: workShapeNode.scaleType,
                type: EPostMessageType.Select,
                selectRect: selectRect,
                willSyncService: false,
                points: workShapeNode.getChildrenPoints()
            });
            console.log('updateFullSelectWork---01', _postData, this.vNodes.curNodeMap, this.drawLayer?.children.map(c => c.name), this.fullLayer?.children.map(c => c.name));
            this._post(_postData);
        }
    }
    destroy() {
        super.destroy();
        this.effectSelectNodeData.clear();
        this.batchEraserWorks.clear();
        this.batchEraserRemoveNodes.clear();
    }
    drawPencilCombine(workId) {
        const result = this.workShapes.get(workId)?.combineConsume();
        if (result) {
            const combineDrawResult = {
                render: [],
                drawCount: this.drawCount
            };
            combineDrawResult.render?.push({
                rect: result?.rect && getSafetyRect(result.rect),
                isClear: true,
                drawCanvas: ECanvasShowType.Float,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId: this.viewId
            });
            this._post(combineDrawResult);
        }
    }
    drawSelector(res, isDrawing) {
        const _postData = {
            render: [],
            sp: [res]
        };
        if (res.type === EPostMessageType.Select && !isDrawing) {
            _postData.render?.push({
                rect: res.selectRect,
                drawCanvas: ECanvasShowType.Selector,
                isClear: true,
                clearCanvas: ECanvasShowType.Selector,
                isFullWork: false,
                viewId: this.viewId
            }, {
                rect: res.rect && getSafetyRect(res.rect),
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId: this.viewId
            }, {
                rect: res.rect && getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Bg,
                isFullWork: true,
                viewId: this.viewId
            });
        }
        if (isDrawing) {
            _postData.render?.push({
                rect: res.rect && getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Float,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: false,
                viewId: this.viewId
            }, {
                rect: res.rect && getSafetyRect(res.rect),
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Bg,
                isFullWork: true,
                viewId: this.viewId
            });
        }
        this._post(_postData);
    }
    async drawEraser(result) {
        const sp = [];
        if (result.newWorkDatas?.size) {
            for (const d of result.newWorkDatas.values()) {
                const workId = d.workId.toString();
                this.batchEraserWorks.add(workId);
                sp.push({
                    type: EPostMessageType.FullWork,
                    workId,
                    ops: transformToSerializableData(d.op),
                    opt: d.opt,
                    toolsType: d.toolsType,
                    updateNodeOpt: {
                        useAnimation: false
                    }
                });
            }
            delete result.newWorkDatas;
        }
        result.removeIds?.forEach((id) => {
            this.batchEraserRemoveNodes.add(id);
        });
        sp.push(result);
        this._post({ sp });
        this.batchEraserCombine();
    }
    drawPencil(res) {
        this._post({
            drawCount: this.drawCount,
            sp: res?.op && [res]
        });
    }
    drawPencilFull(res, opt, workShapeState) {
        const _postData = {
            drawCount: Infinity,
            render: [{
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: workShapeState?.willClear || opt?.isOpacity,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId: this.viewId
                }],
            sp: [res]
        };
        _postData.render?.push({
            isClearAll: true,
            clearCanvas: ECanvasShowType.Float,
            isFullWork: false,
            viewId: this.viewId
        });
        this._post(_postData);
    }
    updateBatchEraserCombineNode(inFullLayerIds, removeIds) {
        const render = [];
        let fullLayerRect;
        for (const key of removeIds.keys()) {
            this.fullLayer.getElementsByName(key).forEach(node => {
                const r = node.getBoundingClientRect();
                fullLayerRect = computRect(fullLayerRect, {
                    x: r.x - EraserShape.SafeBorderPadding,
                    y: r.y - EraserShape.SafeBorderPadding,
                    w: r.width + EraserShape.SafeBorderPadding,
                    h: r.height + EraserShape.SafeBorderPadding,
                });
                node.remove();
            });
        }
        inFullLayerIds.forEach(key => {
            const info = this.vNodes.get(key);
            if (info) {
                const node = this.fullLayer.getElementsByName(key)[0];
                if (!node) {
                    const workShape = this.setFullWork({ ...info, workId: key });
                    // todo check image consumeService
                    const r = workShape && workShape.consumeService({
                        op: info.op,
                        isFullWork: true,
                    });
                    if (r) {
                        info.rect = r;
                        fullLayerRect = computRect(fullLayerRect, r);
                    }
                }
                else {
                    fullLayerRect = computRect(fullLayerRect, info.rect);
                }
            }
        });
        if (fullLayerRect) {
            render.push({
                rect: fullLayerRect,
                isClear: true,
                isFullWork: true,
                clearCanvas: ECanvasShowType.Bg,
                drawCanvas: ECanvasShowType.Bg,
                viewId: this.viewId
            });
        }
        return render;
    }
    async runEffectSelectWork(willSyncService) {
        for (const data of this.effectSelectNodeData.values()) {
            const workShape = this.setFullWork(data);
            if (workShape) {
                if (workShape.toolsType === EToolsKey.Image) {
                    await workShape.consumeServiceAsync({
                        scene: this.drawLayer?.parent?.parent,
                        isFullWork: false,
                        replaceId: workShape.getWorkId()?.toString()
                    });
                }
                else {
                    const op = data.ops && transformToNormalData(data.ops);
                    workShape.consumeService({
                        op,
                        isFullWork: false,
                        replaceId: workShape.getWorkId()?.toString()
                    });
                }
                data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt);
                data.workId && this.workShapes.delete(data.workId);
            }
        }
        this.reRenderSelector(willSyncService);
    }
    cursorHover(msg) {
        const { opt, toolsType, point } = msg;
        const workShape = this.setFullWork({
            workId: Cursor_Hover_Id,
            toolsType,
            opt
        });
        if (workShape && point) {
            const res = workShape.cursorHover(point);
            const _postData = {
                render: []
            };
            if (res && res.type === EPostMessageType.CursorHover) {
                _postData.render?.push({
                    rect: res.rect && getSafetyRect(res.rect),
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    drawCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                    viewId: this.viewId
                });
                this._post(_postData);
            }
        }
    }
}
