/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseTeachingAidsManager } from "../baseTeachingAidsManager";
import { DisplayStateEnum, InternalMsgEmitterType } from "../types";
import throttle from "lodash/throttle";
import { ViewContainerSingleManager } from "./containerManager";
import { TeachingAidsSigleWrapper } from "./teachingAidsDisplayer";
export class TeachingAidsSingleManager extends BaseTeachingAidsManager {
    constructor(plugin, options) {
        super(plugin, options);
        Object.defineProperty(this, "viewContainerManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onCameraChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((cameraState) => {
                // console.log('cameraState', {...cameraState})
                // this.viewContainerManager.setFocuedViewId('mainView');
                this.viewContainerManager.setFocuedViewCameraOpt(cameraState);
            }, 20, { 'leading': false })
        });
        const props = {
            control: this,
            internalMsgEmitter: TeachingAidsSingleManager.InternalMsgEmitter
        };
        this.viewContainerManager = new ViewContainerSingleManager(props);
    }
    init() {
        if (!TeachingAidsSigleWrapper.emiter) {
            TeachingAidsSigleWrapper.emiter = BaseTeachingAidsManager.InternalMsgEmitter;
        }
        TeachingAidsSingleManager.InternalMsgEmitter.on(InternalMsgEmitterType.DisplayState, this.displayStateListener.bind(this));
    }
    displayStateListener(value) {
        if (value === DisplayStateEnum.unmounted) {
            this.destroy();
        }
    }
    activeWorker() {
        this.worker.init();
        // this.cursor.injectWorker(this.worker);
        this.collector.addStorageStateListener((diff) => {
            if (this.collector?.storage) {
                const curKeys = Object.keys(this.collector.storage);
                if (curKeys.length === 0) {
                    this.worker?.clearViewScenePath('mainView', true);
                    return;
                }
            }
            if (diff) {
                const excludeIds = new Map();
                Object.keys(diff).forEach((key) => {
                    const item = diff[key];
                    if (item) {
                        const viewId = item.viewId;
                        const keys = excludeIds.get(viewId) || new Set();
                        keys.add(key);
                        excludeIds.set(viewId, keys);
                        this.worker?.onServiceDerive(key, item);
                    }
                });
                for (const [viewId, keys] of excludeIds.entries()) {
                    TeachingAidsSingleManager.InternalMsgEmitter.emit('excludeIds', [...keys], viewId);
                }
            }
        });
        if (this.room) {
            this.roomMember.onUidChangeHook((diff) => {
                if (this.collector?.serviceStorage) {
                    const selectors = [];
                    this.viewContainerManager.getAllViews().forEach(v => {
                        if (v && v.focusScenePath && this.collector.serviceStorage[v.id] && this.collector.serviceStorage[v.id][v.focusScenePath]) {
                            const s = Object.keys(this.collector.serviceStorage[v.id][v.focusScenePath]).
                                filter(k => this.collector.isSelector(k)).map(key => ({ viewId: v.id, scenePath: v.focusScenePath, key }));
                            s.length && selectors.push(...s);
                        }
                    });
                    selectors.forEach(({ key, viewId, scenePath }) => {
                        const uid = this.collector?.getUidFromKey(key);
                        if (uid && !diff.online.includes(uid)) {
                            this.collector?.updateValue(key, undefined, { isAfterUpdate: true, viewId, scenePath });
                        }
                    });
                }
                if (this.cursor?.eventCollector.serviceStorage) {
                    const eventKeys = Object.keys(this.cursor?.eventCollector.serviceStorage);
                    eventKeys.forEach(uid => {
                        if (!diff.online.includes(uid)) {
                            this.cursor?.eventCollector.clearValue(uid);
                        }
                    });
                }
            });
            setTimeout(() => {
                this.viewContainerManager.getAllViews().forEach(v => {
                    if (v && v.focusScenePath) {
                        this.worker.pullServiceData(v.id, v.focusScenePath);
                    }
                });
            }, 200);
        }
    }
}
