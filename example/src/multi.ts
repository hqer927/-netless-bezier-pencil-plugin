/* eslint-disable @typescript-eslint/no-explicit-any */
import '@netless/window-manager/dist/style.css';
import { WhiteWebSdk, DeviceType, DefaultHotKeys} from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
import { TeachingAidsPlugin, ECanvasContextType } from '@hqer/bezier-pencil-plugin';

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
    // const cursorAdapter = new CursorTool();
    const room = await whiteWebSdk.joinRoom({
        uuid,
        roomToken,
        uid,
        region: "cn-hz",
        isWritable: true,
        floatBar: true,
        // cursorAdapter,
        userPayload: {
            userId: uid.split('uid-')[1],
            userUUID: uid,
            cursorName: `user-${uid}`,
        },
        hotKeys: {
            ...DefaultHotKeys,
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
        invisiblePlugins: [WindowManager, TeachingAidsPlugin],
        disableNewPencil: false,
        useMultiViews: true, 
    })
    if (room.isWritable) {
        room.setScenePath("/init");
    }
    let manager = room.getInvisiblePlugin(WindowManager.kind) as unknown as WindowManager;
    manager?.destroy();
    manager = await WindowManager.mount({ room , container:elm, chessboard: true, cursor: true, supportTeachingAidsPlugin: true});
    if (manager) {
        await manager.switchMainViewToWriter();
        const plugin = await TeachingAidsPlugin.getInstance(manager,
            {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
                options: {
                    syncOpt: {
                        interval: 300,
                    },
                    canvasOpt: {
                        contextType: ECanvasContextType.Canvas2d
                    },
                }
            }
        );
        room.disableSerialization = false;
        // plugin.callbacks.on("onCanUndoStepsUpdate", (step: number): void => {
        //     console.log('onCanUndoStepsUpdate1', step)
        // });
        // plugin.callbacks.on("onCanRedoStepsUpdate", (step: number): void => {
        //     console.log('onCanRedoStepsUpdate1', step)
        // });
        window.pluginRoom = plugin;
    }
    window.manager = manager;
    return {room, whiteWebSdk}
}