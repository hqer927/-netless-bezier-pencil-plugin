/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType, RenderEngine} from "white-web-sdk";
import polly from "polly-js";
import { WindowManager } from "@netless/window-manager";
import { TeachingAidsPlugin, ECanvasContextType } from '@hqer/bezier-pencil-plugin';
import SlideApp, { addHooks } from "@netless/app-slide";

export enum Identity {
    Creator = "creator",
    Joiner = "joiner",
}
export async function createReplayMultiWhiteWebSdk(params:{
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
        region,
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
    const player = await whiteWebSdk.replayRoom(
        {
            slice,
            beginTimestamp: beginAt && parseInt(beginAt, 10) + 1000 || undefined,
            duration: duration && parseInt(duration, 10) || undefined,
            region,
            room: uuid,
            roomToken,
            invisiblePlugins: [WindowManager, TeachingAidsPlugin],
            useMultiViews: true,
        }, {
            onPhaseChanged: (phase) => {
                console.log('onPhaseChanged', phase)
            },
        },
    );
    WindowManager.register({
        kind: "Slide",
        appOptions: { debug: false },
        src: SlideApp,
        addHooks,
    });
    const managerPromise = WindowManager.mount({ room:player , container:elm, chessboard: true, cursor: true, supportTeachingAidsPlugin: true});
    player.play();
    const manager = await managerPromise;
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
    player.pause();
    // await player.seekToProgressTime(1);
    player.play();
    window.pluginRoom = plugin;
    window.manager = manager;
    console.log('player', player)
    return {player, whiteWebSdk}
}
