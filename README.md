 # bezier-pencil-plugin 
 
[中文文档](https://github.com/hqer927/-netless-bezier-pencil-plugin/blob/main/READMA.zh-CN.md)

 
The plug-in is attached to the plug-in mechanism of white-web-sdk to achieve a set of whiteboard teaching AIDS, state synchronization, playback, scene switching and other functions still rely on white-web-sdk or window-manager. 
 
## Introduction 
 
A whiteboard pencil drawing plugin based on SpriteJS as a rendering engine. 
 
The following two demos are implemented in the example folder for reference only. 
| scenario | demo path | depends on | 
| :-- | :----: | :-- | 
| multi-window | example/src/multi.ts | @netless/window-manager, white-web-sdk | 
| white-board | example/src/single.ts | white-web-sdk | 
<!-- | fastboard | todo | todo | -->
 
## Principle 
 
1. The plugin is mainly based on the 2D functionality of SpriteJS, supports webgl2 rendering, and is backward compatible with downgrades to webgl and canvas2d 
2. The plugin uses the dual webWorker+offscreenCanvas mechanism to process the drawing calculation + rendering logic in a separate worker thread. Does not occupy cpu tasks of the main thread. 
 
## Plugin usage 
 
### Install 
 
```bash 
npm install @netless/appliance-plugin 
``` 
 
### Sign up for plugins 
 
Plug-ins can support two scenarios, their access plug-in names are different:
- Multi-window 'ApplianceMultiPlugin' 
```js 
import { ApplianceMultiPlugin } from '@netless/appliance-plugin'; 
``` 
- Single whiteboard 'ApplianceSinglePlugin' 
```js 
import { ApplianceSinglePlugin } from '@netless/appliance-plugin'; 
``` 
 
> workerjs file cdn deployment
> 
> We used two-worker concurrency to improve drawing efficiency, which improved it by more than 40% over single-thread efficiency. However, the common dependencies on the two worker files are repeated, so building directly into the package will greatly increase the package size. So we allow the workerjs file cdn deployment by simply deploying the file under @netless/appliance-plugin/cdn into the cdn and then configuring the c of the last two workerjs via the second parameter of getInstance in the plug-in, options.cdn The dn address is fine. This solves the problem of excessive package size
> 
> - **The total package is about 300kB, and the two wokerjs are 600kB each** If you need to consider the size of the package you are building, select Configure cdn. 
 
### Access mode reference 
 
#### Multi-window mode (Interconnecting with window-manager) 
```js 
import '@netless/window-manager/dist/style.css'; 
import '@netless/appliance-plugin/dist/style.css'; 
import { WhiteWebSdk } from "white-web-sdk"; 
import { WindowManager } from "@netless/window-manager"; 
// All bundled
import { ApplianceMultiPlugin } from '@netless/appliance-plugin'; 
// cdn 
// The following steps are optional. If you use cdn, you do not need to import from dist. If you import from dist, you need to import resources and configure them to options.cdn in bolb inline form. Such as? raw, this requires packaging support,vite default support? raw,webpack needs to be configured.
import fullWorkerString from '@netless/appliance-plugin/dist/fullWorker.js?raw';
import subWorkerString from '@netless/appliance-plugin/dist/subWorker.js?raw';
const fullWorkerBlob = new Blob([fullWorkerString], {type: 'text/javascript'});
const fullWorkerUrl = URL.createObjectURL(fullWorkerBlob);
const subWorkerBlob = new Blob([subWorkerString], {type: 'text/javascript'});
const subWorkerUrl = URL.createObjectURL(subWorkerBlob);
 
const whiteWebSdk = new WhiteWebSdk(...) 
const room = await whiteWebSdk.joinRoom({ 
... 
invisiblePlugins: [WindowManager, ApplianceMultiPlugin], 
useMultiViews: true, 
}) 
const manager = await WindowManager.mount({ room , container:elm, chessboard: true, cursor: true, supportTeachingAidsPlugin: true}); 
if (manager) { 
await manager.switchMainViewToWriter(); 
await ApplianceMultiPlugin.getInstance(manager,
        {
            options: {
                cdn: {
                    fullWorkerUrl,
                    subWorkerUrl,
                }
            }
        }
    ); 
} 
``` 
#### Single whiteboard (interconnection with white-web-sdk) 
```js 
import { WhiteWebSdk } from "white-web-sdk"; 
// All bundled
import { ApplianceSinglePlugin, ApplianceSigleWrapper } from '@netless/appliance-plugin'; 
// The following steps are optional. If you use cdn, you do not need to import from dist. If you import from dist, you need to import resources and configure them to options.cdn in bolb inline form. Such as? raw, this requires packaging support,vite default support? raw,webpack needs to be configured.
import fullWorkerString from '@netless/appliance-plugin/dist/fullWorker.js?raw';
import subWorkerString from '@netless/appliance-plugin/dist/subWorker.js?raw';
const fullWorkerBlob = new Blob([fullWorkerString], {type: 'text/javascript'});
const fullWorkerUrl = URL.createObjectURL(fullWorkerBlob);
const subWorkerBlob = new Blob([subWorkerString], {type: 'text/javascript'});
const subWorkerUrl = URL.createObjectURL(subWorkerBlob);
 
const whiteWebSdk = new WhiteWebSdk(...) 
const room = await whiteWebSdk.joinRoom({ 
... 
invisiblePlugins: [ApplianceSinglePlugin], 
wrappedComponents: [ApplianceSigleWrapper] 
}) 
await ApplianceSinglePlugin.getInstance(room,
    {
        options: {
            cdn: {
                fullWorkerUrl,
                subWorkerUrl,
            }
        }
    }
); 
```
#### About ’?raw‘ webpack configuration
```js
module: {
    rules: [
        // ...
        {
            test: /\.m?js$/,
            resourceQuery: { not: [/raw/] },
            use: [ ... ]
        },
        {
            resourceQuery: /raw/,
            type: 'asset/source',
        }
    ]
},
``` 
 
### Call introduction 
The plug-in re-implements some interfaces of the same name on room or window or manager. If you do not use the interface on the plug-in, you will not get the desired effect. But we can use injectMethodToObject to re-inject it back into the original object to get the plugin's intended effect. As follows: 
1. Interface on room 
- `setMemberState` 
- `undo` 
- `redo` 
- `callbacks` 
- `insertImage` 
- `lockImage` 
- `completeImageUpload` 
- `getImagesInformation` 
- `cleanCurrentScene` 
 
2. windowmanager upper interface 
- `cleanCurrentScene` 
 
3. The mainview interface of windowmanager 
- `setMemberState` 
- `undo` 
- `redo` 
- `callbacks` 
- `insertImage` 
- `lockImage` 
- `completeImageUpload` 
- `getImagesInformation` 
- `cleanCurrentScene` 
 
4. Customize 
- `getBoundingRectAsync` 
- `screenshotToCanvasAsync` 
- `scenePreviewAsync` 
- `destroy`
