/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhiteWebSdk, DeviceType, RenderEngine, InvisiblePlugin, InvisiblePluginClass} from "white-web-sdk";
import polly from "polly-js";
import { WindowManager } from "@netless/window-manager";
import SlideApp, { addHooks } from "@netless/app-slide";
import { ApplianceMultiPlugin } from '@hqer/bezier-pencil-plugin';
import fullWorkerString from '@hqer/bezier-pencil-plugin/dist/fullWorker.js?raw';
import subWorkerString from '@hqer/bezier-pencil-plugin/dist/subWorker.js?raw';

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
            invisiblePlugins: [WindowManager as unknown as InvisiblePluginClass<string, any, any, InvisiblePlugin<any, any>>, ApplianceMultiPlugin],
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
    const managerPromise = WindowManager.mount({ room:player , container:elm, chessboard: true, cursor: true, supportAppliancePlugin: true});
    player.play();
    const manager = await managerPromise;
    const fullWorkerBlob = new Blob([fullWorkerString], {type: 'text/javascript'});
    const fullWorkerUrl = URL.createObjectURL(fullWorkerBlob);
    const subWorkerBlob = new Blob([subWorkerString], {type: 'text/javascript'});
    const subWorkerUrl = URL.createObjectURL(subWorkerBlob);
    const plugin = await ApplianceMultiPlugin.getInstance(manager,{
        options: {
            cdn:{
                fullWorkerUrl,
                subWorkerUrl
            }
        },
    });
    player.pause();
    // await player.seekToProgressTime(1);
    player.play();
    window.appliancePlugin = plugin;
    window.manager = manager;
    console.log('player', player)
    return {player, whiteWebSdk}
}
