/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { EPostMessageType } from "../core/enum";
import { autorun, toJS } from "white-web-sdk";
import { BaseCollector } from "./base";
import { plainObjectKeys, transformToNormalData, transformToSerializableData } from "./utils";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
/**
 * 服务端事件/状态同步收集器
 */
export class Collector extends BaseCollector {
    // private syncBatchMap: Map<string, BaseCollectorReducerAction> = new Map();
    constructor(plugin) {
        super();
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plugin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "stateDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.plugin = plugin;
        this.uid = plugin.displayer.uid;
        const namespace = plugin.displayer.state.sceneState.sceneName;
        this.setNamespace(namespace);
    }
    addStorageStateListener(callBack) {
        this.stateDisposer = autorun(async () => {
            const storage = toJS(this.plugin.attributes[this.namespace]);
            const diff = this.diffFun(this.storage, storage);
            this.storage = storage;
            // console.log('storage1', diff);
            for (const key of Object.keys(diff)) {
                const item = diff[key];
                if (item) {
                    // console.log('dispatch---222',item)
                    callBack(key, item);
                }
            }
        });
    }
    removeStorageStateListener() {
        if (this.stateDisposer) {
            this.stateDisposer();
        }
    }
    diffFun(_old, _new) {
        const oldKeys = plainObjectKeys(_old);
        const newKeys = plainObjectKeys(_new);
        const diff = {};
        for (const key of oldKeys) {
            if (newKeys.includes(key)) {
                if (isEqual(_old[key], _new[key])) {
                    continue;
                }
                diff[key] = {
                    oldValue: cloneDeep(_old[key]),
                    newValue: cloneDeep(_new[key])
                };
                continue;
            }
            diff[key] = {
                oldValue: cloneDeep(_old[key]),
                newValue: undefined
            };
        }
        for (const key of newKeys) {
            if (oldKeys.includes(key)) {
                if (isEqual(_old[key], _new[key])) {
                    continue;
                }
                continue;
            }
            diff[key] = {
                oldValue: undefined,
                newValue: cloneDeep(_new[key])
            };
        }
        return diff;
    }
    transformKey(workId) {
        return this.uid + '@##@' + workId;
    }
    isOwn(key) {
        return key.split('@##@')[0] === this.uid;
    }
    dispatch(action) {
        // console.log('dispatch', action)
        const { type, workId, ops, index, opt, toolstype, w, h, removeIds, updateNodeOpt, op } = action;
        switch (type) {
            case EPostMessageType.Clear:
                const state = {};
                Object.keys(this.storage).filter(f => f !== 'scene').map(key => {
                    state[key] = undefined;
                });
                this.setState(state);
                break;
            case EPostMessageType.UpdateScene:
                if (w && h) {
                    // const state = { 
                    //     scene: {
                    //         uid:this.uid,
                    //         w,
                    //         h,
                    //     }
                    // };
                    // this.setState(state);
                    this.updateValue('scene', {
                        uid: this.uid,
                        w,
                        h,
                    });
                }
                break;
            case EPostMessageType.CreateWork:
                if (workId && toolstype && opt) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    // const work:ISerializableStorageData = {}
                    // work[key] = {
                    //     type: EPostMessageType.CreateWork,
                    //     workId,
                    //     toolstype,
                    //     opt
                    // };
                    // this.setState(work); 
                    this.updateValue(key.toString(), {
                        type: EPostMessageType.CreateWork,
                        workId,
                        toolstype,
                        opt
                    });
                }
                break;
            case EPostMessageType.UpdateWork:
                if (workId && toolstype && opt) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    // const work:ISerializableStorageData = {}
                    // work[key] = {
                    //     ...old,
                    //     type: EPostMessageType.UpdateWork,
                    //     workId,
                    //     toolstype,
                    //     opt
                    // };
                    // this.setState(work);
                    this.updateValue(key.toString(), {
                        ...old,
                        type: EPostMessageType.UpdateWork,
                        workId,
                        toolstype,
                        opt
                    });
                }
                break;
            case EPostMessageType.DrawWork:
                if (workId && typeof index === 'number' && op?.length) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    // console.log('DrawWork', (old?.op || []), index * 3, op, (old?.op || []).slice(0,index * 3).concat(op))
                    const _op = (old?.op || []).slice(0, index).concat(op);
                    if (old && _op) {
                        // const state:ISerializableStorageData = {}
                        // state[key] = {
                        //     ...old,
                        //     type: EPostMessageType.DrawWork,
                        //     op: _op,
                        //     index
                        // };
                        // this.setState(state);
                        this.updateValue(key.toString(), {
                            ...old,
                            type: EPostMessageType.DrawWork,
                            op: _op,
                            index
                        });
                    }
                }
                break;
            case EPostMessageType.FullWork:
                if (workId) {
                    const key = this.isLocalId(workId.toString()) ? this.transformKey(workId) : workId;
                    const old = this.storage[key];
                    const _toolstype = toolstype || old?.toolstype;
                    const _opt = opt || old?.opt;
                    if (old && _toolstype && _opt && ops) {
                        // const state:ISerializableStorageData = {}
                        // state[key] = {
                        //     type: EPostMessageType.FullWork,
                        //     workId: key,
                        //     toolstype: _toolstype,
                        //     opt: _opt,
                        //     ops
                        // }; 
                        // this.setState(state); 
                        this.updateValue(key.toString(), {
                            type: EPostMessageType.FullWork,
                            workId: key,
                            toolstype: _toolstype,
                            opt: _opt,
                            ops
                        });
                    }
                }
                break;
            case EPostMessageType.RemoveNode:
                if (removeIds?.length) {
                    // const state1: ISerializableStorageData = {};
                    const _removeIds = removeIds.map(id => {
                        if (this.isLocalId(id + '')) {
                            return this.transformKey(id);
                        }
                        return id;
                    });
                    Object.keys(this.storage).filter(f => f !== 'scene').map(key => {
                        if (_removeIds?.includes(key)) {
                            // state1[key] = undefined;
                            this.updateValue(key, undefined);
                        }
                    });
                    // this.setState(state1);
                }
                break;
            case EPostMessageType.UpdateNode:
                if (workId && updateNodeOpt) {
                    const old = this.storage[workId];
                    if (old) {
                        old.updateNodeOpt = updateNodeOpt;
                        // const work:ISerializableStorageData = {
                        //     [workId]: old
                        // };
                        // this.setState(work);
                        this.updateValue(workId.toString(), old);
                    }
                }
                break;
            default:
                break;
        }
    }
    setState(state) {
        const keys = plainObjectKeys(state);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = state[key];
            if (typeof value !== 'undefined') {
                this.storage[key] = value;
            }
            else {
                delete this.storage[key];
            }
        }
        const attr = {};
        attr[this.namespace] = this.storage;
        this.plugin.setAttributes(attr);
    }
    updateValue(key, value) {
        this.storage[key] = value;
        this.plugin.updateAttributes([this.namespace, key], value);
    }
    transformToSerializableData(data) {
        return transformToSerializableData(data);
    }
    transformToNormalData(str) {
        return transformToNormalData(str);
    }
    keyTransformWorkId(key) {
        const list = key.split('@##@');
        return list.length === 2 ? list[1] : key;
    }
    destroy() {
        // TODO
    }
}
