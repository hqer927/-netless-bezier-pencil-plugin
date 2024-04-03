/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType, Room} from "white-web-sdk";
import {CursorTool} from "@netless/cursor-tool";
import { ECanvasContextType } from "@hqer/bezier-pencil-plugin";
import { TeachingAidsSigleWrapper } from "@hqer/bezier-pencil-plugin/dist/plugin/single/teachingAidsDisplayer";
import { TeachingAidsPlugin } from "@hqer/bezier-pencil-plugin/dist/plugin/teachingAidsPlugin";
export async function createWhiteWebSdk(elm:HTMLDivElement) {
    const uuid = 'fdd7b7e0f01011ee8cba8bd8d2de3add';
    const roomToken = 'NETLESSROOM_YWs9VWtNUk92M1JIN2I2Z284dCZleHBpcmVBdD0xNzEyMTEwODk3MzQ4Jm5vbmNlPWJiOWRlODQwLWYwOTctMTFlZS04MTAzLWRmMDYxY2VkZTJlYyZyb2xlPTEmc2lnPTc1ZjlhZDcxYjc3NmI5MjIzNjg2ZjFiZDgzNDQzYzljMzE1MjAzYzUzMzUyMTRiMWRkNTUxMDdhZDQ3MDkxZDMmdXVpZD1mZGQ3YjdlMGYwMTAxMWVlOGNiYThiZDhkMmRlM2FkZA';
    const appIdentifier = '123456789/987654321';
    // const plugins = createPlugins({ "bezierPencilPlugin": bezierPencilPlugin });
    const whiteWebSdk = new WhiteWebSdk({
        appIdentifier,
        useMobXState: true,
        deviceType: DeviceType.Surface,
        invisiblePlugins: [TeachingAidsPlugin],
        wrappedComponents: [TeachingAidsSigleWrapper]
    })
    const uid = 'uid-' + Math.floor(Math.random() * 10000);
    const cursorAdapter = new CursorTool();
    let room = await whiteWebSdk.joinRoom({
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
        disableNewPencil: false,
    })
    const plugin = await TeachingAidsPlugin.getInstance(room, 
        {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
            logger: {   // 自定义日志，可选，如果不传则使用 console api
                info: console.log,
                error: console.error,
                warn: console.warn,
            },
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
    plugin.displayer.bindHtmlElement(elm);
    (plugin.displayer as Room).disableSerialization = false;
    window.pluginRoom = plugin;
    return {room, whiteWebSdk}
} 


