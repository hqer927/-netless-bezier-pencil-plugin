import { EventMessageType, EvevtWorkState } from "../core";
import { EventCollector } from "../collector/eventCollector";
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
    // private worker?: MasterController;
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
        this.eventCollector = new EventCollector(control.plugin, this.control.pluginOptions?.syncOpt?.interval);
        this.eventCollector.addStorageStateListener((event) => {
            // console.log('addStorageStateListener- eventCollector', event)
            event.forEach((value, uid) => {
                if (this.eventCollector.uid !== uid) {
                    const ops = [];
                    value?.forEach(v => {
                        if (v && v.type === EventMessageType.Cursor && v.op && v.viewId) {
                            const op = [];
                            for (let i = 0; i < v.op.length; i += 2) {
                                const op1 = v.op[i];
                                const op2 = v.op[i + 1];
                                if (isNumber(op1) && isNumber(op2)) {
                                    const _op = this.control.viewContainerManager.transformToOriginPoint([op1, op2], v.viewId);
                                    op.push(..._op, v.viewId);
                                }
                                else {
                                    op.push(op1, op2, v.viewId);
                                }
                            }
                            ops.push(...op);
                        }
                    });
                    if (ops.length) {
                        // console.log('activePointWorkShape', ops)
                        this.activePointWorkShape(uid, ops);
                        this.runAnimation();
                        if (this.removeTimerId) {
                            clearTimeout(this.removeTimerId);
                            this.removeTimerId = undefined;
                        }
                    }
                }
            });
        });
    }
    activePointWorkShape(uid, op) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        const workShape1 = this.animationDrawWorkers.get(uid);
        const workShape = this.animationPointWorkers.get(uid);
        if (!workShape && op) {
            const workItem = {
                animationIndex: 0,
                animationWorkData: op,
                freeze: workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing,
            };
            this.animationPointWorkers?.set(uid, workItem);
            return;
        }
        if (workShape && op) {
            workShape.animationWorkData = op;
            workShape.animationIndex = 0;
            workShape.freeze = workShape1?.workState === EvevtWorkState.Start || workShape1?.workState === EvevtWorkState.Doing;
        }
    }
    activeDrawWorkShape(uid, op, workState, viewId) {
        const roomMember = this.roomMember.getRoomMember(uid);
        if (!roomMember) {
            return;
        }
        if (workState === EvevtWorkState.Start) {
            const workShape1 = this.animationPointWorkers.get(uid);
            if (!workShape1) {
                const workItem = {
                    animationIndex: 0,
                    animationWorkData: [],
                    freeze: true,
                };
                this.animationDrawWorkers?.set(uid, workItem);
            }
            else {
                workShape1.animationWorkData = [];
                workShape1.animationIndex = 0;
                workShape1.freeze = true;
            }
        }
        else if (workState === EvevtWorkState.Done) {
            const workShape1 = this.animationPointWorkers.get(uid);
            if (workShape1) {
                workShape1.freeze = false;
            }
        }
        const workShape = this.animationDrawWorkers.get(uid);
        const ops = [];
        if (op) {
            for (let i = 0; i < op.length; i += 2) {
                ops.push(op[i], op[i + 1], viewId);
            }
        }
        if (!workShape && ops.length) {
            const workItem = {
                animationIndex: 0,
                animationWorkData: ops,
                workState
            };
            this.animationDrawWorkers?.set(uid, workItem);
            return;
        }
        if (workShape && ops.length) {
            workShape.animationWorkData = ops;
            workShape.animationIndex = 0;
            workShape.workState = workState;
        }
    }
    animationCursor() {
        this.animationId = undefined;
        const cursorInfos = new Map();
        this.animationPointWorkers.forEach((workShape, uid) => {
            const freeze = workShape.freeze;
            if (freeze) {
                return;
            }
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 3;
                }
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex + 1];
                const viewId = workShape.animationWorkData[curIndex + 2];
                cursorInfos.set(uid, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined,
                    viewId
                });
                if (workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationPointWorkers.delete(uid);
                }
            }
        });
        this.animationDrawWorkers.forEach((workShape, uid) => {
            const curIndex = workShape.animationIndex;
            const roomMember = this.roomMember.getRoomMember(uid);
            if (roomMember) {
                if (workShape.animationWorkData.length - 1 > curIndex) {
                    workShape.animationIndex = curIndex + 3;
                }
                const x = workShape.animationWorkData[curIndex];
                const y = workShape.animationWorkData[curIndex + 1];
                const viewId = workShape.animationWorkData[curIndex + 2];
                cursorInfos.set(uid, {
                    x,
                    y,
                    roomMember: isNumber(x) && isNumber(y) && roomMember || undefined,
                    viewId
                });
                if (workShape.animationWorkData.length - 1 <= workShape.animationIndex) {
                    this.animationDrawWorkers.delete(uid);
                }
            }
        });
        this.control.viewContainerManager.setActiveCursor([...cursorInfos.values()]);
        if (this.animationPointWorkers.size || this.animationDrawWorkers.size) {
            this.runAnimation();
        }
    }
    runAnimation() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animationCursor.bind(this));
        }
    }
    // injectWorker(worker: MasterController){
    //     this.worker = worker;
    // }
    sendEvent(point, viewId) {
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: isNumber(point[0]) && isNumber(point[1]) && this.control.viewContainerManager.transformToScenePoint(point, viewId) || [undefined, undefined],
            viewId
        });
    }
    collectServiceCursor(data) {
        const { op, uid, workState, viewId } = data;
        if (uid && op && workState && viewId) {
            if (this.removeTimerId) {
                clearTimeout(this.removeTimerId);
                this.removeTimerId = undefined;
            }
            const _op = isNumber(op[0]) && isNumber(op[1]) && this.control.viewContainerManager.transformToOriginPoint(op, viewId) || op;
            this.activeDrawWorkShape(uid, _op, workState, viewId);
            this.runAnimation();
            if (workState === EvevtWorkState.Done && !this.removeTimerId) {
                this.removeTimerId = setTimeout(() => {
                    this.removeTimerId = undefined;
                    this.activeDrawWorkShape(uid, [undefined, undefined], EvevtWorkState.Done, viewId);
                    this.runAnimation();
                }, 3000);
            }
        }
    }
    unable() {
        this.eventCollector.dispatch({
            type: EventMessageType.Cursor,
            op: [undefined, undefined],
            viewId: this.control.viewContainerManager.focuedViewId
        });
    }
    destroy() {
        this.eventCollector.destroy();
    }
}
