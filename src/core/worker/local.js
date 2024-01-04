import { transformToNormalData, transformToSerializableData } from "../../collector/utils";
import { SubLocalWork } from "../base";
import { ECanvasShowType, EPostMessageType, EToolsKey, EvevtWorkState } from "../enum";
import { SelectorShape } from "../tools";
import { computRect, rotatePoints, scalePoints } from "../utils";
import { EStrokeType, EmitEventType } from "../../plugin/types";
export class SubLocalWorkForWorker extends SubLocalWork {
    constructor(curNodeMap, layer, drawLayer, postFun) {
        super(curNodeMap, layer, drawLayer);
        Object.defineProperty(this, "_post", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workShapes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
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
        Object.defineProperty(this, "drawCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this._post = postFun;
    }
    drawPencilCombine(workId) {
        const result = this.workShapes.get(workId)?.combineConsume();
        if (result) {
            const combineDrawResult = {
                render: {
                    rect: result?.rect,
                    isClear: true,
                    drawCanvas: ECanvasShowType.Float,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                }
            };
            Promise.resolve(combineDrawResult).then((msg) => {
                msg.drawCount = this.drawCount;
                this._post(msg);
            });
        }
    }
    drawSelector(res, isDrawing) {
        //console.log('drawSelector', res, isDrawing)
        if (res.selectIds?.length && !isDrawing) {
            this._post({
                render: res.rect && {
                    rect: res.selectRect,
                    drawCanvas: ECanvasShowType.Selector,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Selector,
                    isFullWork: false,
                },
                sp: [res]
            });
            this._post({
                render: res.rect && {
                    rect: res.selectRect || res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                },
                sp: [res]
            });
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
        if (isDrawing) {
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Float,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Float,
                    isFullWork: false,
                },
                sp: [res]
            });
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
    }
    drawEraser(res, workShapeNode) {
        Promise.resolve(res).then((result) => {
            const sp = [];
            if (result.newWorkDatas?.length) {
                sp.push(...result.newWorkDatas.map(d => ({
                    type: EPostMessageType.FullWork,
                    workId: d.workId,
                    ops: transformToSerializableData(d.op),
                    opt: d.opt,
                    toolsType: d.toolsType,
                    updateNodeOpt: {
                        useAnimation: false
                    }
                })));
                delete result.newWorkDatas;
            }
            sp.push(result);
            this._post({
                render: {
                    rect: result.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp
            });
            for (let i = 0; i < sp.length; i++) {
                if (sp[i].removeIds?.length) {
                    sp[i].removeIds?.forEach(id => {
                        this.curNodeMap.delete(id);
                        workShapeNode.curNodeMap.delete(id);
                    });
                }
                else if (sp[i].type === EPostMessageType.FullWork) {
                    const key = sp[i].workId?.toString();
                    if (key) {
                        const ops = sp[i].ops;
                        const opt = sp[i].opt;
                        const toolsType = sp[i].toolsType;
                        this.updataNodeMap({
                            key,
                            ops,
                            opt,
                            toolsType,
                        });
                        // console.log('updataNodeMap111')
                    }
                }
            }
        });
    }
    drawPencil(res) {
        this._post({
            drawCount: this.drawCount,
            sp: res?.op && [res]
        });
    }
    drawPencilFull(res, opt) {
        if ((opt.opacity || 1) < 1) {
            this._post({
                render: res.rect && {
                    rect: res.rect,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                }
            });
        }
        this._post({
            render: res.rect && {
                rect: res.rect,
                drawCanvas: ECanvasShowType.Bg,
                isClear: true,
                clearCanvas: ECanvasShowType.Float,
                isFullWork: true,
            },
            sp: [res]
        });
        if (res.workId) {
            this.updataNodeMap({
                key: res.workId.toString(),
                ops: res.ops,
                toolsType: EToolsKey.Pencil,
                opt
            });
        }
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
                isFullWork: true,
                nodeMaps: this.curNodeMap
            });
            if (toolsType === EToolsKey.Selector) {
                if (result.type === EPostMessageType.Select) {
                    result.selectIds && serviceWork.runReverseSelectWork(result.selectIds);
                    this.drawSelector(result, true);
                }
                return;
            }
            if (toolsType === EToolsKey.Eraser) {
                if (result.newWorkDatas?.length) {
                    let rect = result?.rect;
                    result.newWorkDatas.forEach(c => {
                        const workShape = this.setFullWork(c);
                        const r = workShape && workShape.consumeService({
                            op: c.op,
                            isFullWork: true,
                        });
                        const name = c.workId.toString();
                        if (r) {
                            workShapeNode.updataNodeMap(name, {
                                name,
                                rect: r,
                                opt: c.opt,
                                toolsType: c.toolsType,
                                op: c.op
                            });
                            rect = computRect(rect, r);
                        }
                    });
                    if (rect) {
                        result.rect = rect;
                    }
                }
                if (result?.rect) {
                    this.drawEraser(result, workShapeNode);
                }
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
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
            }
        }
    }
    consumeDrawAll(data, serviceWork) {
        if (this.combineTimerId) {
            clearTimeout(this.combineTimerId);
            this.combineTimerId = undefined;
        }
        const { workId } = data;
        if (workId) {
            const workShapeNode = this.workShapes.get(workId);
            if (!workShapeNode) {
                return;
            }
            this.drawCount = 0;
            const toolsType = workShapeNode.toolsType;
            if (toolsType === EToolsKey.LaserPen) {
                return;
            }
            //console.log('consumeDrawAll', data)
            const r = workShapeNode.consumeAll({
                data,
                nodeMaps: this.curNodeMap
            });
            if (toolsType === EToolsKey.Selector) {
                r.selectIds && serviceWork.runReverseSelectWork(r.selectIds);
                this.drawSelector(r, false);
                if (!workShapeNode.selectIds?.length) {
                    this.clearWorkShapeNodeCache(workId);
                }
                else {
                    workShapeNode.clearTmpPoints();
                }
                return;
            }
            if (toolsType === EToolsKey.Eraser) {
                if (r?.rect) {
                    this.drawEraser(r, workShapeNode);
                }
                workShapeNode.clearTmpPoints();
                return;
            }
            if (toolsType === EToolsKey.Pencil) {
                if (r?.rect) {
                    // const opacity = workShapeNode.getWorkOptions().opacity || 1 ;
                    this.drawPencilFull(r, workShapeNode.getWorkOptions());
                }
                this.clearWorkShapeNodeCache(workId);
            }
        }
    }
    updateSelector(param) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (!workShapeNode.selectIds?.length)
            return;
        const { updateSelectorOpt, willRefreshSelector, willSyncService, willSerializeData, emitEventType, selectStore } = param;
        const workState = updateSelectorOpt.workState;
        let rect;
        const isDelay = (emitEventType === EmitEventType.RotateNode || emitEventType === EmitEventType.ScaleNode) && workState === EvevtWorkState.Done && willSerializeData;
        if (willRefreshSelector && workShapeNode) {
            rect = workShapeNode.oldRect;
        }
        const res = workShapeNode?.updateSelector({
            updateSelectorOpt,
            selectIds: workShapeNode.selectIds,
        });
        let render = res && willRefreshSelector && {
            rect: emitEventType === EmitEventType.ScaleNode && workState !== EvevtWorkState.Done ? computRect(rect, res.rect) : res.rect,
            isClear: true,
            isFullWork: false,
            clearCanvas: emitEventType === EmitEventType.ScaleNode ? ECanvasShowType.Float : ECanvasShowType.Selector,
            drawCanvas: emitEventType === EmitEventType.ScaleNode && workState !== EvevtWorkState.Done ? ECanvasShowType.Float : ECanvasShowType.Selector,
        } || undefined;
        // console.log('updateSelector', render, res?.rect)
        if (res && willRefreshSelector && willSerializeData && render && !isDelay) {
            // console.log('updateSelector1', render, res?.rect)
            this._post({ render });
            // this.computNodeMap();
            render = undefined;
        }
        const newServiceStore = new Map();
        if (willSerializeData) {
            if (res?.updateNodeOpts && selectStore) {
                for (const [key, info] of selectStore.entries()) {
                    const { ops, opt, updateNodeOpt, toolsType } = info;
                    let newPos;
                    const newOpt = opt;
                    const newUpdateNodeOpt = { ...updateNodeOpt, ...res.updateNodeOpts.get(key) };
                    let nop = [];
                    if (newOpt && newUpdateNodeOpt.color) {
                        newOpt.color = newUpdateNodeOpt.color;
                        delete newUpdateNodeOpt.color;
                    }
                    if (newOpt && newUpdateNodeOpt.zIndex) {
                        newOpt.zIndex = newUpdateNodeOpt.zIndex;
                        delete newUpdateNodeOpt.zIndex;
                    }
                    if (newOpt && newUpdateNodeOpt.opacity) {
                        newOpt.opacity = newUpdateNodeOpt.opacity;
                        delete newUpdateNodeOpt.opacity;
                    }
                    if (ops && newUpdateNodeOpt?.pos && newUpdateNodeOpt?.originPos) {
                        // const op = (transformToNormalData(ops) as number[]);
                        const translate = [newUpdateNodeOpt.pos[0] - newUpdateNodeOpt.originPos[0], newUpdateNodeOpt.pos[1] - newUpdateNodeOpt.originPos[1]];
                        const op = transformToNormalData(ops).map((n, index) => {
                            const i = index % 3;
                            if (i === 0) {
                                return n + translate[0];
                            }
                            if (i === 1) {
                                return n + translate[1];
                            }
                            return n;
                        });
                        if (newUpdateNodeOpt.scale) {
                            scalePoints(op, newUpdateNodeOpt.pos, newUpdateNodeOpt.scale);
                            nop = op;
                            delete newUpdateNodeOpt.scale;
                        }
                        newPos = transformToSerializableData(op);
                        this.drawLayer?.getElementsByName(key).forEach(c => {
                            if (newUpdateNodeOpt.pos) {
                                const className = c.className.split(',');
                                c.setAttribute('className', `${newUpdateNodeOpt.pos[0]}, ${newUpdateNodeOpt.pos[1]}, ${className[2]}`);
                            }
                        });
                        delete newUpdateNodeOpt.originPos;
                    }
                    if (ops && newUpdateNodeOpt.angle && newUpdateNodeOpt.originPos) {
                        const op = transformToNormalData(ops);
                        rotatePoints(op, newUpdateNodeOpt.originPos, newUpdateNodeOpt.angle);
                        nop = op;
                        newPos = transformToSerializableData(op);
                        delete newUpdateNodeOpt.angle;
                        delete newUpdateNodeOpt.originPos;
                        // this.drawLayer?.getElementsByName(key).forEach(c=>c.remove());
                    }
                    if (toolsType && ops && opt && nop.length) {
                        const workShape = this.createWorkShapeNode({
                            toolsType,
                            toolsOpt: opt
                        });
                        workShape?.setWorkId(key);
                        workShape?.consumeService({
                            op: nop,
                            isFullWork: false,
                            replaceId: key,
                            isClearAll: false
                        });
                    }
                    newServiceStore.set(key, {
                        ops: newPos,
                        updateNodeOpt: newUpdateNodeOpt,
                        opt: newOpt,
                        toolsType
                    });
                }
            }
        }
        if (res && res.updateNodeOpts?.size) {
            delete updateSelectorOpt.workState;
            const sp = [];
            if (willSyncService) {
                if (willSerializeData) {
                    if (emitEventType === EmitEventType.RotateNode && workState === EvevtWorkState.Done) {
                        sp.push({
                            type: EPostMessageType.Select,
                            selectIds: workShapeNode.selectIds,
                            selectRect: res.rect,
                        });
                    }
                    for (const [workId, info] of newServiceStore.entries()) {
                        sp.push({
                            ...info,
                            workId,
                            type: EPostMessageType.UpdateNode,
                        });
                    }
                }
                else {
                    for (const [workId, updateNodeOpt] of res.updateNodeOpts.entries()) {
                        sp.push({
                            workId,
                            type: EPostMessageType.UpdateNode,
                            updateNodeOpt
                        });
                    }
                }
            }
            if (willSyncService) {
                this._post({
                    render: !isDelay && render || undefined,
                    sp: (willSyncService && sp) || undefined
                });
            }
            if (isDelay && render) {
                setTimeout(() => {
                    this._post({
                        render,
                    });
                    if (workState === EvevtWorkState.Done) {
                        workShapeNode.selectIds?.forEach(key => {
                            const info = sp?.find(s => s?.workId && s.workId === key);
                            this.updataNodeMap({
                                key,
                                ops: info?.ops,
                                opt: info?.opt
                            });
                        });
                    }
                }, 20);
            }
            if (!isDelay && workState === EvevtWorkState.Done) {
                workShapeNode.selectIds?.forEach(key => {
                    const info = sp?.find(s => s?.workId && s.workId === key);
                    this.updataNodeMap({
                        key,
                        ops: info?.ops,
                        opt: info?.opt
                    });
                });
            }
        }
    }
    blurSelector() {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        if (workShapeNode) {
            const res = workShapeNode?.blurSelector();
            this.clearWorkShapeNodeCache(SelectorShape.selectorId);
            this._post({
                render: res?.rect && {
                    rect: res.rect,
                    drawCanvas: ECanvasShowType.Bg,
                    isClear: true,
                    clearCanvas: ECanvasShowType.Bg,
                    isFullWork: true,
                },
                sp: [res]
            });
        }
    }
    setFullWork(data) {
        const { workId, opt, toolsType } = data;
        if (workId && opt && toolsType) {
            const curWorkShapes = (workId && this.workShapes.get(workId)) || this.createWorkShapeNode({
                toolsOpt: opt,
                toolsType
            });
            if (!curWorkShapes) {
                return;
            }
            curWorkShapes.setWorkId(workId);
            this.workShapes.set(workId, curWorkShapes);
            return curWorkShapes;
        }
    }
    consumeFull(data) {
        const workShape = this.setFullWork(data);
        const op = data.ops && transformToNormalData(data.ops);
        if (workShape) {
            let rect = workShape.consumeService({
                op,
                isFullWork: true,
                replaceId: workShape.getWorkId()?.toString()
            });
            rect = computRect(rect, data?.updateNodeOpt && workShape.updataOptService(data.updateNodeOpt));
            if (rect && data.willRefresh) {
                this._post({
                    render: {
                        rect,
                        drawCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                    },
                    sp: (data.willSyncService && [{
                            opt: data.opt,
                            toolsType: data.toolsType,
                            type: EPostMessageType.FullWork,
                            workId: data.workId,
                            ops: data.ops,
                            updateNodeOpt: data.updateNodeOpt
                        }]) || undefined
                });
                if (data.workId) {
                    this.updataNodeMap({
                        key: data.workId?.toString(),
                        ops: data.ops,
                        opt: data.opt,
                        toolsType: data.toolsType,
                    });
                }
            }
            data.workId && this.workShapes.delete(data.workId);
        }
    }
    updateNode(param) {
        const { workId, updateNodeOpt, willRefresh, willSyncService } = param;
        if (workId) {
            const workIdStr = workId.toString();
            let rect;
            const itemOpt = {};
            this.fullLayer.getElementsByName(workIdStr).forEach(p => {
                if (willRefresh) {
                    const r = p.getBoundingClientRect();
                    rect = computRect(rect, {
                        x: Math.floor(r.x - 10),
                        y: Math.floor(r.y - 10),
                        w: Math.floor(r.width + 20),
                        h: Math.floor(r.height + 20)
                    });
                }
                if (updateNodeOpt.pos) {
                    itemOpt.pos = updateNodeOpt.pos;
                    p.setAttribute('pos', updateNodeOpt.pos);
                }
                if (updateNodeOpt.zIndexDistance || updateNodeOpt.zIndex) {
                    if (updateNodeOpt.zIndexDistance) {
                        const ZIndex = p.getAttribute('zIndex');
                        itemOpt.zIndex = ZIndex + updateNodeOpt.zIndex;
                    }
                    else {
                        itemOpt.zIndex = updateNodeOpt.zIndex;
                    }
                    p.setAttribute('zIndex', itemOpt.zIndex);
                }
                if (updateNodeOpt.color) {
                    itemOpt.color = updateNodeOpt.color;
                    p.setAttribute('strokeColor', itemOpt.color);
                    if (p.getAttribute('fillColor')) {
                        p.setAttribute('strokeColor', itemOpt.color);
                    }
                }
                if (willRefresh) {
                    const r1 = p.getBoundingClientRect();
                    rect = computRect(rect, {
                        x: Math.floor(r1.x - 10),
                        y: Math.floor(r1.y - 10),
                        w: Math.floor(r1.width + 20),
                        h: Math.floor(r1.height + 20)
                    });
                }
            });
            if (rect || willSyncService) {
                this._post({
                    render: rect && {
                        rect,
                        drawCanvas: ECanvasShowType.Bg,
                        isClear: true,
                        clearCanvas: ECanvasShowType.Bg,
                        isFullWork: true,
                    },
                    sp: (willSyncService && [{
                            type: EPostMessageType.UpdateNode,
                            workId,
                            updateNodeOpt: itemOpt
                        }]) || undefined
                });
            }
        }
    }
    removeWork(data) {
        const { workId } = data;
        const key = workId?.toString();
        if (key) {
            this.workShapes.has(key) && this.clearWorkShapeNodeCache(key);
            let rect;
            const removeNode = [];
            const nodeMapItem = this.curNodeMap.get(key);
            if (nodeMapItem) {
                this.curNodeMap.delete(key);
            }
            this.fullLayer.getElementsByName(key).concat(this.drawLayer?.getElementsByName(key) || []).forEach(node => {
                if (nodeMapItem) {
                    rect = computRect(rect, nodeMapItem.rect);
                }
                else {
                    const r = node.getBoundingClientRect();
                    rect = computRect(rect, {
                        x: r.x,
                        y: r.y,
                        w: r.width,
                        h: r.height
                    });
                }
                removeNode.push(node);
            });
            if (removeNode.length) {
                removeNode.forEach(r => r.remove());
            }
            if (rect) {
                this._post({
                    render: {
                        rect,
                        isClear: true,
                        isFullWork: true,
                        clearCanvas: ECanvasShowType.Bg,
                        drawCanvas: ECanvasShowType.Bg
                    }
                });
            }
            this.curNodeMap.delete(key);
        }
    }
    runReverseSelectWork(data) {
        const workShapeNode = this.workShapes.get(SelectorShape.selectorId);
        const { selectIds } = data;
        const backIds = [];
        if (workShapeNode && selectIds && workShapeNode.selectIds) {
            for (const id of selectIds) {
                const i = workShapeNode.selectIds.findIndex(_id => _id === id);
                if (i > -1) {
                    workShapeNode.selectIds.splice(i, 1);
                    backIds.push(id);
                }
            }
            if (backIds.length) {
                const cloneNodes = [];
                if (workShapeNode.selectIds.length !== 0) {
                    this.rerRenderSelector();
                }
                let rect;
                backIds.forEach(id => {
                    const node = this.drawLayer?.getElementsByName(id)[0];
                    if (node) {
                        const cloneP = node.cloneNode(true);
                        if (cloneP.tagName === 'GROUP') {
                            const other = node.className.split(',');
                            if (other.length === 3 && Number(other[2]) === EStrokeType.Stroke) {
                                cloneP.seal();
                            }
                        }
                        cloneNodes.push(cloneP);
                        // console.log('runReverseSelectWork')
                        node.remove();
                        const n = this.curNodeMap.get(id);
                        if (n) {
                            rect = computRect(rect, n.rect);
                        }
                    }
                });
                cloneNodes.length && this.fullLayer.append(...cloneNodes);
                if (rect) {
                    this._post({
                        render: {
                            rect: rect,
                            isClear: true,
                            isFullWork: true,
                            clearCanvas: ECanvasShowType.Bg,
                            drawCanvas: ECanvasShowType.Bg,
                        },
                        sp: workShapeNode.selectIds.length === 0 && [{
                                type: EPostMessageType.Select,
                                selectIds: [],
                                willSyncService: false
                            }] || undefined
                    });
                }
            }
        }
    }
}
