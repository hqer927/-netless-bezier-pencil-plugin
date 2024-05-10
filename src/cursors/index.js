import { EventMessageType, EvevtWorkState } from "../core";
import { EventCollector } from "../collector/eventCollector";
import { Storage_Splitter } from "../collector";
import isNumber from "lodash/isNumber";
// import { MasterController } from "../core/mainEngine";
export var CursorColloctSource;
(function (CursorColloctSource) {
    CursorColloctSource[CursorColloctSource["Event"] = 0] = "Event";
    CursorColloctSource[CursorColloctSource["Storage"] = 1] = "Storage";
})(CursorColloctSource || (CursorColloctSource = {}));
export class CursorManager {
}
export class CursorManagerImpl {
    constructor(props) {
        Object.defineProperty(this, "internalMsgEmitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "control", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventCollector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomMember", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeTimerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "asyncEndInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationPointWorkers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "animationDrawWorkers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        const { control, internalMsgEmitter } = props;
        this.internalMsgEmitter = internalMsgEmitter;
        this.control = control;
        this.roomMember = control.roomMember;
    }
    activeCollector() {
        if (this.control.plugin) {
            this.eventCollector = new EventCollector(this.control.plugin, Math.min(this.control.pluginOptions?.syncOpt?.interval || 100, 100));
            this.eventCollector.addStorageStateListener((event) => {
                event.forEach((value, uid) => {
                    if (this.eventCollector?.uid !== uid) {
                        const ops = new Map();
                        value?.forEach(v => {
                            if (v && v.type === EventMessageType.Cursor && v.op && v.viewId) {
                                const op = [];
                                for (let i = 0; i < v.op.length; i += 2) {
                                    const op1 = v.op[i];
                                    const op2 = v.op[i + 1];
                                    if (isNumber(op1) && isNumber(op2)) {
                                        const _op = this.control.viewContainerManager.transformToOriginPoint([op1, op2], v.viewId);
                                        op.push(_op[0], _op[1]);
                                    }
                                    else {
                                        op.push(op1, op2);
                                    }
                                }
                                ops.set(v.viewId, op);
                            }
                        });
                        if (ops.size) {
                            this.activePointWorkShape(uid, ops);
                            this.runAnimation();
                        }
                    }
                });
            });
        }
    }
    onFocusViewChange() {
        const focuedViewId = this.control.viewContainerManager.focuedViewId;
        for (const key of this.animationDrawWorkers.keys()) {
            const u = this.getUidAndviewId(key).uid;
            const v = this.getUidAndviewId(key).viewId;
            if (v !== focuedViewId) {
                this.activeDrawWorkShape(u, [undefined, undefined], EvevtWorkState.Done, v);
            }
        }
        const opsU = new Map();
        for (const key of this.animationPointWorkers.keys()) {
            const u = this.getUidAndviewId(key).uid;
            const v = this.getUidAndviewId(key).viewId;
            if (v !== focuedViewId) {
                const ops = opsU.get(u) || new Map();
                ops.set(v, [undefined, undefined]);
                opsU.set(u, ops);
            }
        }
        if (opsU.size) {
            for (const [uid, ops] of opsU.entries()) {
                this.activePointWorkShape(uid, ops);
            }
        }
        this.runAnimation();
    }
    activePointWorkShape(uid, ops) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        for (const [viewId, op] of ops.entries()) {
            const key = this.getKey(uid, viewId);
            let freeze = false;
            const allViewIds = this.control.viewContainerManager.getAllViews().map(v => v?.id);
            for (const v of allViewIds) {
                if (v && v !== viewId) {
                    const curKey = this.getKey(uid, v);
                    const drawWorkShape = this.animationDrawWorkers.get(curKey);
                    const isDrawing = drawWorkShape?.workState === EvevtWorkState.Start || drawWorkShape?.workState === EvevtWorkState.Doing || false;
                    if (isDrawing) {
                        freeze = true;
                        break;
                    }
                    else {
                        if (this.removeTimerId) {
                            clearTimeout(this.removeTimerId);
                            this.removeTimerId = undefined;
                        }
                        if (drawWorkShape) {
                            this.activeDrawWorkShape(uid, [undefined, undefined], EvevtWorkState.Done, v);
                            this.runAnimation();
                        }
                        else {
                            const workShape = this.animationPointWorkers.get(curKey);
                            if (!workShape) {
                                const workItem = {
                                    animationIndex: 0,
                                    animationWorkData: [undefined, undefined],
                                    freeze: false
                                };
                                this.animationPointWorkers.set(curKey, workItem);
                            }
                            else {
                                workShape.animationWorkData = [undefined, undefined];
                                workShape.animationIndex = 0;
                                workShape.freeze = false;
                            }
                        }
                    }
                }
            }
            const workShape = this.animationPointWorkers.get(key);
            if (op) {
                if (!workShape) {
                    const workItem = {
                        animationIndex: 0,
                        animationWorkData: op,
                        freeze
                    };
                    this.animationPointWorkers?.set(key, workItem);
                    return;
                }
                workShape.animationWorkData = op;
                workShape.animationIndex = 0;
                workShape.freeze = freeze;
            }
        }
    }
    getKey(uid, viewId) {
        return `${uid}${Storage_Splitter}${viewId}`;
    }
    getUidAndviewId(key) {
        const [uid, viewId] = key.split(Storage_Splitter);
        return { uid, viewId };
    }
    animationCursor() {
        this.animationId = undefined;
        const cursorInfos = new Map();
        this.animationPointWorkers.forEach((workShape, key) => {
            const { uid } = this.getUidAndviewId(key);
            const freeze = workShape.freeze;
            if (freeze) {
                return;
            }
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 2;
                }
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex + 1];
                cursorInfos.set(key, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                });
                if (workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationPointWorkers.delete(key);
                }
            }
        });
        this.animationDrawWorkers.forEach((workShape, key) => {
            const { uid } = this.getUidAndviewId(key);
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 2;
                }
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex + 1];
                cursorInfos.set(key, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined
                });
                if (workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationDrawWorkers.delete(key);
                }
            }
        });
        for (const [key, info] of cursorInfos.entries()) {
            const { viewId } = this.getUidAndviewId(key);
            this.control.viewContainerManager.setActiveCursor(viewId, info);
        }
        if (this.animationPointWorkers.size || this.animationDrawWorkers.size) {
            this.runAnimation();
        }
    }
    activeDrawWorkShape(uid, op, workState, viewId) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        const key = this.getKey(uid, viewId);
        if (workState === EvevtWorkState.Start) {
            const workShape1 = this.animationPointWorkers.get(key);
            if (!workShape1) {
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: [],
                    freeze: true,
                };
                this.animationDrawWorkers?.set(key, workItem);
            }
            else {
                workShape1.animationWorkData = [];
                workShape1.animationIndex = 0;
                workShape1.freeze = true;
            }
        }
        else if (workState === EvevtWorkState.Done) {
            const workShape1 = this.animationPointWorkers.get(key);
            if (workShape1) {
                workShape1.freeze = false;
            }
        }
        const workShape = this.animationDrawWorkers.get(key);
        if (op) {
            if (!workShape) {
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: op,
                    workState
                };
                this.animationDrawWorkers?.set(key, workItem);
                return;
            }
            workShape.animationWorkData = op;
            workShape.animationIndex = 0;
            workShape.workState = workState;
        }
    }
    runAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationCursor.bind(this));
        }
    }
    sendEvent(point, viewId) {
        this.eventCollector?.dispatch({
            type: EventMessageType.Cursor,
            op: isNumber(point[0]) && isNumber(point[1]) && this.control.viewContainerManager.transformToScenePoint(point, viewId) || [undefined, undefined],
            viewId
        });
    }
    collectServiceCursor(data) {
        const { op, uid, workState, viewId } = data;
        if (uid && op && workState && viewId) {
            const focuedViewId = this.control.viewContainerManager.focuedViewId;
            if (workState === EvevtWorkState.Done) {
                if (viewId !== focuedViewId) {
                    this.activeDrawWorkShape(uid, [undefined, undefined], workState, viewId);
                    this.runAnimation();
                    return;
                }
                if (this.removeTimerId) {
                    clearTimeout(this.removeTimerId);
                    this.removeTimerId = undefined;
                    if (this.asyncEndInfo && this.asyncEndInfo.viewId !== viewId && this.asyncEndInfo.uid === uid) {
                        this.activeDrawWorkShape(uid, [undefined, undefined], EvevtWorkState.Done, this.asyncEndInfo.viewId);
                    }
                }
                this.asyncEndInfo = { uid, viewId };
                this.removeTimerId = setTimeout(() => {
                    this.removeTimerId = undefined;
                    this.activeDrawWorkShape(uid, [undefined, undefined], EvevtWorkState.Done, viewId);
                    this.runAnimation();
                }, 10000);
            }
            if (isNumber(op[0]) && isNumber(op[1])) {
                const _op = this.control.viewContainerManager.transformToOriginPoint(op, viewId);
                this.activeDrawWorkShape(uid, _op, workState, viewId);
            }
            this.runAnimation();
        }
    }
    unabled() {
        this.eventCollector?.dispatch({
            type: EventMessageType.Cursor,
            op: [undefined, undefined],
            viewId: this.control.viewContainerManager.focuedViewId
        });
    }
    destroy() {
        this.eventCollector?.destroy();
    }
}
