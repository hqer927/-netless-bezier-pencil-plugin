/* eslint-disable @typescript-eslint/no-explicit-any */
import '@netless/window-manager/dist/style.css';
import { WhiteWebSdk, DeviceType, DefaultHotKeys, HotKeyEvent, KeyboardKind, InvisiblePluginClass, InvisiblePlugin} from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import { ApplianceMultiPlugin } from '@hqer/bezier-pencil-plugin';
import fullWorkerString from '@hqer/bezier-pencil-plugin/dist/fullWorker.js?raw';
import subWorkerString from '@hqer/bezier-pencil-plugin/dist/subWorker.js?raw';
const ctrlShiftHotKeyCheckerWith = (k:string) =>{
    return (event: HotKeyEvent, kind: KeyboardKind) => {
        const { key, altKey, ctrlKey, shiftKey, nativeEvent } = event;
        switch (kind) {
            case KeyboardKind.Mac: {
                return (
                    key === k &&
                    !ctrlKey &&
                    !altKey &&
                    shiftKey &&
                    !!nativeEvent?.metaKey
                );
            }
            case KeyboardKind.Windows: {
                return (
                    key === k &&
                    ctrlKey &&
                    !altKey &&
                    shiftKey &&
                    event.kind === "KeyDown"
                );
            }
            default: {
                return false;
            }
        }
    };

}
export async function createMultiWhiteWebSdk(params:{
    elm:HTMLDivElement;
    uuid:string;
    roomToken:string;
    appIdentifier:string;
}) {
    const {elm, uuid, roomToken, appIdentifier} = params;
    const whiteWebSdk = new WhiteWebSdk({
        appIdentifier,
        useMobXState: true,
        deviceType: DeviceType.Surface,
        // apiHosts: [
        //     "api-cn-hz.netless.group",
        // ],
    })
    const uid = sessionStorage.getItem('uid') || 'uid-' + Math.floor(Math.random() * 10000);
    sessionStorage.setItem('uid', uid);
    const room = await whiteWebSdk.joinRoom({
        uuid,
        roomToken,
        uid,
        region: "cn-hz",
        isWritable: true,
        floatBar: true,
        userPayload: {
            userId: uid.split('uid-')[1],
            userUUID: uid,
            cursorName: `user-${uid}`,
        },
        hotKeys: {
            ...DefaultHotKeys,
            redo: ctrlShiftHotKeyCheckerWith("z"),
            changeToSelector: "s",
            changeToLaserPointer: "z",
            changeToPencil: "p",
            changeToRectangle: "r",
            changeToEllipse: "c",
            changeToEraser: "e",
            changeToText: "t",
            changeToStraight: "l",
            changeToArrow: "a",
            changeToHand: "h",
        },
        invisiblePlugins: [WindowManager as unknown as InvisiblePluginClass<string, any, any, InvisiblePlugin<any, any>>, ApplianceMultiPlugin],
        disableNewPencil: false,
        useMultiViews: true, 
    })
    if (room.isWritable) {
        room.setScenePath("/init");
    }
    let manager = room.getInvisiblePlugin(WindowManager.kind) as unknown as WindowManager;
    manager?.destroy();
    manager = await WindowManager.mount({ room , container:elm, chessboard: true, cursor: true, supportAppliancePlugin: true});
    if (manager) {
        await manager.switchMainViewToWriter();
        const fullWorkerBlob = new Blob([fullWorkerString], {type: 'text/javascript'});
        const fullWorkerUrl = URL.createObjectURL(fullWorkerBlob);
        const subWorkerBlob = new Blob([subWorkerString], {type: 'text/javascript'});
        const subWorkerUrl = URL.createObjectURL(subWorkerBlob);
        const plugin = await ApplianceMultiPlugin.getInstance(manager,
            {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
                options: {
                    cdn: {
                        fullWorkerUrl,
                        subWorkerUrl
                    }
                }
            }
        );
        room.disableSerialization = false;
        // room.callbacks.on("onCanUndoStepsUpdate", (step: number): void => {
        //     console.log('onCanUndoStepsUpdate1', step)
        // });
        // room.callbacks.on("onCanRedoStepsUpdate", (step: number): void => {
        //     console.log('onCanRedoStepsUpdate1', step)
        // });
        window.appliancePlugin = plugin;
    }
    window.manager = manager;
    return {room, whiteWebSdk, manager}
}