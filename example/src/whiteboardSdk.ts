/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType} from "white-web-sdk";
import { BezierPencilPlugin } from "../../src/plugin/index";
import { BezierPencilDisplayer } from "../../src/plugin/index";
import { ECanvasContextType } from "@hqer/bezier-pencil-plugin";

export async function createWhiteWebSdk(elm:HTMLDivElement) {
    const uuid = 'd4b898208dd211eeb62adde695452dc9';
    const roomToken = 'NETLESSROOM_YWs9VWtNUk92M1JIN2I2Z284dCZleHBpcmVBdD0xNzAxMjUxMTE0ODMwJm5vbmNlPWQ0ZDJkNmUwLThkZDItMTFlZS1iZDVhLTE1NGY2YTdkMzViNiZyb2xlPTEmc2lnPTA5ZGNjZWRjODczMjE2YTUzZTRhZWEzN2U1MTA0MzlhMzRiODRiNTI4NzdlY2QzYmRjMDM3MGY4YWVkYTQyYmUmdXVpZD1kNGI4OTgyMDhkZDIxMWVlYjYyYWRkZTY5NTQ1MmRjOQ';
    const appIdentifier = '123456789/987654321';
    // const plugins = createPlugins({ "bezierPencilPlugin": bezierPencilPlugin });
    const whiteWebSdk = new WhiteWebSdk({
        appIdentifier,
        useMobXState: true,
        deviceType: DeviceType.Surface,
        invisiblePlugins: [BezierPencilPlugin],
        wrappedComponents: [BezierPencilDisplayer]
    })
    let room = await whiteWebSdk.joinRoom({
        uuid,
        roomToken,
        uid: 'uid-'+Math.floor(Math.random() * 10000),
        region: "cn-hz",
        invisiblePlugins: [BezierPencilPlugin],
        isWritable: true,
    })
    room = await BezierPencilPlugin.getInstance(room, 
        {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
            logger: {   // 自定义日志，可选，如果不传则使用 console api
                info: console.log,
                error: console.error,
                warn: console.warn,
            },
            options: {
                syncOpt: {
                    interval: 1000,
                },
                canvasOpt: {
                    contextType: ECanvasContextType.Canvas2d
                }
            }
        }
    );
    room.bindHtmlElement(elm);
    return {room, whiteWebSdk}
} 


