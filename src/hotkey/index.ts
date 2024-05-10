/* eslint-disable @typescript-eslint/no-explicit-any */
import  { ApplianceNames } from "white-web-sdk";
import type { HotKeys, Point } from "white-web-sdk";
import { BaseSubWorkModuleProps, EmitEventType, InternalMsgEmitterType, MemberState } from "../plugin/types";
import { BaseTeachingAidsManager } from "../plugin/baseTeachingAidsManager";
import type EventEmitter2 from "eventemitter2";
import { EToolsKey, ICameraOpt } from "../core";
import { MethodBuilderMain } from "../core/msgEvent";
import { Storage_Selector_key } from "../collector/const";
import { BaseCollectorReducerAction, Collector } from "../collector";
import { MasterControlForWorker } from "../core/mainEngine";
import { CopyNodeMethod } from "../core/msgEvent/copyNode/forMain";
import { cloneDeep } from "lodash";

export type HotKeyChecker = (event: HotKeyEvent, kind: KeyboardKind) => boolean;
export type HotKeyEvent = {
    readonly nativeEvent?: KeyboardEvent;
    readonly kind: "KeyDown" | "KeyUp";
    readonly key: string;
    readonly altKey: boolean;
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
};
export enum KeyboardKind {
    Mac = "mac",
    Windows = "windows",
}
export type HotKeyCheckerNode = {
    readonly kind: keyof HotKeys;
    readonly checker: HotKeyChecker;
};

export interface HotkeyManager {
    readonly internalMsgEmitter: EventEmitter2;
    readonly control: BaseTeachingAidsManager;
    readonly roomHotkeyCheckers: HotKeyCheckerNode[];
    onActiveHotkey(hotKey: keyof HotKeys):void;
    onSelfActiveHotkey(hotKey: keyof HotKeys):void;
    colloctHotkey(e: KeyboardEvent):void;
}
export class HotkeyManagerImpl implements HotkeyManager {
    internalMsgEmitter: EventEmitter2;
    control: BaseTeachingAidsManager;
    roomHotkeyCheckers: HotKeyCheckerNode[];
    private tmpCopyStore:Map<string,BaseCollectorReducerAction>= new Map();
    private tmpCopyCoordInfo?: {
        offset: Point;
        cameraOpt: Pick<ICameraOpt, "centerX" | "centerY" | "scale">;
    };
    constructor(props:BaseSubWorkModuleProps){
        const {control, internalMsgEmitter } = props;
        this.control = control;
        this.internalMsgEmitter = internalMsgEmitter;
        this.roomHotkeyCheckers = ((this.control.room as any)?.viewsParams.hotKeys.nodes || []) as HotKeyCheckerNode[];
    }
    get isUseSelf():boolean{
        return this.control.room?.disableDeviceInputs || false;
    }
    get isSelector():boolean {
        return this.control.worker.currentToolsData?.toolsType === EToolsKey.Selector;
    }
    get collector():Collector | undefined {
        return this.control.collector;
    }
    get mainEngine(): MasterControlForWorker | undefined {
        return this.control.worker;
    }
    get keyboardKind(): KeyboardKind {
        if (/^Mac/i.test(navigator.platform)) {
            return KeyboardKind.Mac;
        } else {
            return KeyboardKind.Windows;
        }
    }
    private getEventKey(e: KeyboardEvent): "KeyDown" | "KeyUp" {
        switch (e.type) {
            case 'keydown':
                return 'KeyDown';
        }
        return 'KeyUp';
    }
    onActiveHotkey(hotKey: keyof HotKeys): void {
        console.log('onActiveHotkey---sdk', hotKey)
        const viewId = this.control.viewContainerManager.focuedViewId;
        const focusScenePath = this.control.viewContainerManager.focuedView?.focusScenePath;
        if (viewId && focusScenePath) {
            switch (hotKey) {
                case 'delete': 
                    if (this.isSelector && this.collector?.hasSelector(viewId, focusScenePath)) {
                        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.DeleteNode, {workIds: [Storage_Selector_key], viewId})
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
        if(hotKey === 'changeToPencil' || hotKey === 'redo' || hotKey === 'undo'){
            this.onSelfActiveHotkey(hotKey);
        } 
    }
    colloctHotkey(e: KeyboardEvent): void {
        if (this.isUseSelf) {
            const hotkey = this.checkHotkey(e);
            hotkey && this.onSelfActiveHotkey(hotkey);
        }
    }
    onSelfActiveHotkey(hotKey: keyof HotKeys): void {
        console.log('onActiveHotkey---self', hotKey)
        switch (hotKey) {
            case 'changeToPencil':
                this.setMemberState({currentApplianceName:ApplianceNames.pencil, useNewPencil:true});
                break;
            case 'changeToArrow':
                this.setMemberState({currentApplianceName:ApplianceNames.arrow});
                break;
            case 'changeToClick':
                this.setMemberState({currentApplianceName:ApplianceNames.clicker});
                break;
            case 'changeToEllipse':
                this.setMemberState({currentApplianceName:ApplianceNames.ellipse});
                break;
            case 'changeToEraser':
                this.setMemberState({currentApplianceName:ApplianceNames.eraser, isLine:true});
                break;
            case 'changeToHand':
                this.setMemberState({currentApplianceName:ApplianceNames.hand});
                break;
            case 'changeToLaserPointer':
                this.setMemberState({currentApplianceName:ApplianceNames.laserPointer});
                break; 
            case 'changeToSelector':
                this.setMemberState({currentApplianceName:ApplianceNames.selector});
                break;
            case 'changeToRectangle':
                this.setMemberState({currentApplianceName:ApplianceNames.rectangle});
                break;
            case 'changeToStraight':
                this.setMemberState({currentApplianceName:ApplianceNames.straight});
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
                this.setMemberState({currentApplianceName:ApplianceNames.text});
                break;
            // case 'changeToPencilEraser':
            //     this.setMemberState({currentApplianceName:ApplianceNames.eraser, isLine:false});
            //     break;                                
            default:
                break;
        }
    }
    private checkHotkey(e: KeyboardEvent): keyof HotKeys | undefined {
        for (const checkNode of this.roomHotkeyCheckers) {
            const {kind, checker} = checkNode;
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
    private copySelectorToTemp(viewId:string, focusScenePath:string){
        const view = this.control.viewContainerManager.getView(viewId);
        const copyNodeMethod = this.mainEngine?.methodBuilder?.getBuilder(EmitEventType.CopyNode) as CopyNodeMethod;
        if (!view || !this.collector || !copyNodeMethod) {
            return;
        }
        const key = this.collector.transformKey(Storage_Selector_key);
        const curScenePathStore = this.collector.getStorageData(viewId, focusScenePath);
        if(!curScenePathStore){
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
    private pasteTempToFocusView(viewId:string, scenePath:string) {
        const view = this.control.viewContainerManager.getView(viewId);
        const copyNodeMethod = this.mainEngine?.methodBuilder?.getBuilder(EmitEventType.CopyNode) as CopyNodeMethod;
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
            })
        }
    }
    private setMemberState(modifyState: Partial<MemberState>): void {
        this.control.room?.setMemberState(modifyState);
    }
}