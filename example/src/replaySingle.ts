/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType, RenderEngine} from "white-web-sdk";
import polly from "polly-js";
import { CursorTool } from '@netless/cursor-tool';
import { TeachingAidsPlugin, ECanvasContextType, TeachingAidsSigleWrapper } from '@hqer/bezier-pencil-plugin';

export enum Identity {
    Creator = "creator",
    Joiner = "joiner",
}
export async function createReplaySingleWhiteWebSdk(params:{
    elm: HTMLDivElement;
    uuid: string;
    roomToken: string;
    appIdentifier: string;
    slice?:string;
    beginAt?:string;
    duration?:string;
}) {
    const {elm, uuid, roomToken, slice, beginAt, duration, appIdentifier} = params;
    const region = "cn-hz";
    const whiteWebSdk = new WhiteWebSdk({
        deviceType: DeviceType.Surface,
        useMobXState: true,
        preloadDynamicPPT: true,
        appIdentifier,
        renderEngine: RenderEngine.Canvas,
        region
    });
    await polly().waitAndRetry(10).executeForPromise(async () => {
        const isPlayable = await whiteWebSdk.isPlayable({
            region,
            room: uuid,
            roomToken,
        });
        if (!isPlayable) {
            throw Error("the current room cannot be replay");
        }

    });
    const cursorAdapter = new CursorTool();
    const player = await whiteWebSdk.replayRoom(
        {
            slice,
            beginTimestamp: beginAt && parseInt(beginAt, 10) || undefined,
            duration: duration && parseInt(duration, 10) || undefined,
            region,
            room: uuid,
            roomToken,
            cursorAdapter,
            invisiblePlugins: [TeachingAidsPlugin],
            wrappedComponents: [TeachingAidsSigleWrapper]
        }, {
            onPhaseChanged: (phase) => {
                console.log('onPhaseChanged === 1', phase)
            },
        },
    );
    cursorAdapter.setPlayer(player);
    await TeachingAidsPlugin.getInstance(player,
        {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
            options: {
                syncOpt: {
                    interval: 300,
                },
                canvasOpt: {
                    contextType: ECanvasContextType.Canvas2d
                },
            },
            cursorAdapter
        }
    );
    player.bindHtmlElement(elm);
    player.play();
    // try {
    //     await player.seekToProgressTime(100);
    // } catch (error) {console.error(error);}
    console.log('player', player)
    return {player, whiteWebSdk}
}
