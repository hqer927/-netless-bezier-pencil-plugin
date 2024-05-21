/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmitEventType, InternalMsgEmitterType } from "../plugin/types";
import { ApplianceNames } from "../plugin/external";
import { EToolsKey } from "../core";
import { MethodBuilderMain } from "../core/msgEvent";
import { Storage_Selector_key } from "../collector/const";
import { cloneDeep } from "lodash";
export var KeyboardKind;
(function (KeyboardKind) {
    KeyboardKind["Mac"] = "mac";
    KeyboardKind["Windows"] = "windows";
})(KeyboardKind || (KeyboardKind = {}));
export class HotkeyManagerImpl {
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
        Object.defineProperty(this, "roomHotkeyCheckers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tmpCopyStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "tmpCopyCoordInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { control, internalMsgEmitter } = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        this.roomHotkeyCheckers = (this.control.room?.viewsParams.hotKeys.nodes || []);
    }
    get isUseSelf() {
        return this.control.room?.disableDeviceInputs || false;
    }
    get isSelector() {
        return this.control.worker.currentToolsData?.toolsType === EToolsKey.Selector;
    }
    get collector() {
        return this.control.collector;
    }
    get mainEngine() {
        return this.control.worker;
    }
    get keyboardKind() {
        if (/^Mac/i.test(navigator.platform)) {
            return KeyboardKind.Mac;
        }
        else {
            return KeyboardKind.Windows;
        }
    }
    getEventKey(e) {
        switch (e.type) {
            case 'keydown':
                return 'KeyDown';
        }
        return 'KeyUp';
    }
    onActiveHotkey(hotKey) {
        console.log('onActiveHotkey---sdk', hotKey);
        const viewId = this.control.viewContainerManager.focuedViewId;
        const focusScenePath = this.control.viewContainerManager.focuedView?.focusScenePath;
        if (viewId && focusScenePath) {
            switch (hotKey) {
                case 'delete':
                    if (this.isSelector && this.collector?.hasSelector(viewId, focusScenePath)) {
                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.DeleteNode, { workIds: [Storage_Selector_key], viewId });
                    }
                    break;
                case 'copy':
                    if (this.isSelector && this.collector?.hasSelector(viewId, focusScenePath)) {
                        this.copySelectorToTemp(viewId, focusScenePath);
                    }
                    break;
                case 'paste':
                    if (this.tmpCopyStore.size) {
                        this.pasteTempToFocusView(viewId, focusScenePath);
                    }
                    break;
                default:
                    break;
            }
        }
        if (hotKey === 'changeToPencil' || hotKey === 'redo' || hotKey === 'undo') {
            this.onSelfActiveHotkey(hotKey);
        }
    }
    colloctHotkey(e) {
        if (this.isUseSelf) {
            const hotkey = this.checkHotkey(e);
            hotkey && this.onSelfActiveHotkey(hotkey);
        }
    }
    onSelfActiveHotkey(hotKey) {
        console.log('onActiveHotkey---self', hotKey);
        switch (hotKey) {
            case 'changeToPencil':
                this.setMemberState({ currentApplianceName: ApplianceNames.pencil, useNewPencil: true });
                break;
            case 'changeToArrow':
                this.setMemberState({ currentApplianceName: ApplianceNames.arrow });
                break;
            case 'changeToClick':
                this.setMemberState({ currentApplianceName: ApplianceNames.clicker });
                break;
            case 'changeToEllipse':
                this.setMemberState({ currentApplianceName: ApplianceNames.ellipse });
                break;
            case 'changeToEraser':
                this.setMemberState({ currentApplianceName: ApplianceNames.eraser, isLine: true });
                break;
            case 'changeToHand':
                this.setMemberState({ currentApplianceName: ApplianceNames.hand });
                break;
            case 'changeToLaserPointer':
                this.setMemberState({ currentApplianceName: ApplianceNames.laserPointer });
                break;
            case 'changeToSelector':
                this.setMemberState({ currentApplianceName: ApplianceNames.selector });
                break;
            case 'changeToRectangle':
                this.setMemberState({ currentApplianceName: ApplianceNames.rectangle });
                break;
            case 'changeToStraight':
                this.setMemberState({ currentApplianceName: ApplianceNames.straight });
                break;
            case 'redo':
                if (this.control.room && !this.control.room.disableSerialization) {
                    this.control.viewContainerManager.redo();
                }
                break;
            case 'undo':
                if (this.control.room && !this.control.room.disableSerialization) {
                    this.control.viewContainerManager.undo();
                }
                break;
            case 'changeToText':
                this.setMemberState({ currentApplianceName: ApplianceNames.text });
                break;
            // case 'changeToPencilEraser':
            //     this.setMemberState({currentApplianceName:ApplianceNames.eraser, isLine:false});
            //     break;                                
            default:
                break;
        }
    }
    checkHotkey(e) {
        for (const checkNode of this.roomHotkeyCheckers) {
            const { kind, checker } = checkNode;
            if (checker({
                nativeEvent: e,
                kind: this.getEventKey(e),
                key: e.key,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey
            }, this.keyboardKind)) {
                return kind;
            }
        }
    }
    copySelectorToTemp(viewId, focusScenePath) {
        const view = this.control.viewContainerManager.getView(viewId);
        const copyNodeMethod = this.mainEngine?.methodBuilder?.getBuilder(EmitEventType.CopyNode);
        if (!view || !this.collector || !copyNodeMethod) {
            return;
        }
        const key = this.collector.transformKey(Storage_Selector_key);
        const curScenePathStore = this.collector.getStorageData(viewId, focusScenePath);
        if (!curScenePathStore) {
            return;
        }
        const curSelectorStore = curScenePathStore[key];
        const pasteParam = curSelectorStore && copyNodeMethod.copySelector({
            viewId,
            store: curSelectorStore
        });
        if (pasteParam) {
            this.tmpCopyCoordInfo = pasteParam?.copyCoordInfo;
            this.tmpCopyStore = pasteParam?.copyStores;
        }
    }
    pasteTempToFocusView(viewId, scenePath) {
        const view = this.control.viewContainerManager.getView(viewId);
        const copyNodeMethod = this.mainEngine?.methodBuilder?.getBuilder(EmitEventType.CopyNode);
        if (!view || !this.tmpCopyCoordInfo || !this.tmpCopyStore.size || !this.collector || !copyNodeMethod) {
            return;
        }
        if (view.viewData && this.tmpCopyCoordInfo) {
            const offset = cloneDeep(this.tmpCopyCoordInfo.offset);
            const oldCameraOpt = this.tmpCopyCoordInfo.cameraOpt;
            const newCameraOpt = view.viewData.camera;
            offset.x = offset.x + newCameraOpt.centerX - oldCameraOpt.centerX;
            offset.y = offset.y + newCameraOpt.centerY - oldCameraOpt.centerY;
            copyNodeMethod.pasteSelector({
                viewId,
                scenePath,
                copyStores: cloneDeep(this.tmpCopyStore),
                copyCoordInfo: {
                    offset,
                    cameraOpt: newCameraOpt
                }
            });
        }
    }
    setMemberState(modifyState) {
        this.control.room?.setMemberState(modifyState);
    }
}
