/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType} from "white-web-sdk";
import { BezierPencilPlugin, BezierPencilDisplayer, ECanvasContextType } from "@hqer/bezier-pencil-plugin";

export async function createWhiteWebSdk(elm:HTMLDivElement) {
    const uuid = '7820b400a86011eeab9ddd27c4b4849e';
    const roomToken = 'NETLESSROOM_YWs9VWtNUk92M1JIN2I2Z284dCZleHBpcmVBdD0xNzA0MTcwNjc4Mjg5Jm5vbmNlPTc4NDA5ODEwLWE4NjAtMTFlZS1iZDVhLTE1NGY2YTdkMzViNiZyb2xlPTEmc2lnPWU1ZWU3ZGM4MTkwY2IxY2IyNjFkM2YxOGU1YmZmNDcxMDI1OTAxZDAxZmI1ODU4NTAzMjczMTZlNjlmNDczODMmdXVpZD03ODIwYjQwMGE4NjAxMWVlYWI5ZGRkMjdjNGI0ODQ5ZQ';
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
        isWritable: true,
        floatBar: true
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
                    interval: 500,
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


