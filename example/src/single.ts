import { ECanvasContextType, TeachingAidsPlugin, TeachingAidsSigleWrapper } from '@hqer/bezier-pencil-plugin';
import { CursorTool } from '@netless/cursor-tool';
import { WhiteWebSdk, DeviceType, DefaultHotKeys} from "white-web-sdk";

export async function createWhiteWebSdk(params:{
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
        invisiblePlugins: [TeachingAidsPlugin],
        wrappedComponents: [TeachingAidsSigleWrapper]
    })
    const uid = 'uid-' + Math.floor(Math.random() * 10000);
    const cursorAdapter = new CursorTool();
    const room = await whiteWebSdk.joinRoom({
        uuid,
        roomToken,
        uid,
        region: "cn-hz",
        isWritable: true,
        floatBar: true,
        cursorAdapter,
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
        disableNewPencil: false,
    })
    const plugin = await TeachingAidsPlugin.getInstance(room, 
        {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
            options: {
                syncOpt: {
                    interval: 500,
                },
                canvasOpt: {
                    contextType: ECanvasContextType.Canvas2d
                }
            },
            cursorAdapter
        }
    );
    cursorAdapter.setRoom(room);
    
    room.bindHtmlElement(elm);
    room.disableSerialization = false;
    window.pluginRoom = plugin;
    return {room, whiteWebSdk}
} 