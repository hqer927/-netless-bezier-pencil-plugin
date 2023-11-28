 # bezier-pencil-plugin 
 
The plug-in is attached to the plug-in mechanism of white-web-sdk, and encapsulates Bessel pencil drawing as a whiteboard custom invisible plug-in type. All status synchronization is synchronized by the attributes of the plug-in to realize status synchronization between users. 
 
In the example folder, the plug-in is imported as a dependency. You can use the access method in the example folder to access the whiteboard. 
 
## Introduction 
 
A whiteboard pencil drawing plugin based on SpriteJS as a rendering engine. 
 
## Principle 
 
1. This plug-in is mainly implemented based on the Path class of SpriteJS, which realizes the function of drawing Bezier curve through the Path class, and realizes the transition animation of laser pointer through the transition. 
2. The plugin uses the dual worker+offscreenCanvas mechanism to process the drawing calculation + rendering logic in an independent worker thread. Achieved high performance optimization. 
 
## Plugin usage 
 
### Install 
 
```bash 
npm install @hqer/bezier-pencil-plugin 
```
 
### Register 
 
```js 
import { WhiteWebSdk, DeviceType} from "white-web-sdk"; 
import { BezierPencilPlugin, BezierPencilDisplayer, ECanvasContextType } from "@hqer/bezier-pencil-plugin"; 
 
const whiteWebSdk = new WhiteWebSdk({ 
    appIdentifier, 
    useMobXState: true, 
    deviceType: DeviceType.Surface, 
    invisiblePlugins: [BezierPencilPlugin], 
    wrappedComponents: [BezierPencilDisplayer] 
} 
let room = await whiteWebSdk.joinRoom({ 
    uuid, 
    roomToken, 
    uid, 
    region: "cn-hz", 
    invisiblePlugins: [BezierPencilPlugin], 
    isWritable: true, 
}) 
room = await BezierPencilPlugin.getInstance(room, 
{// Get plug-in instance, there should be only one plug-in instance globally, which must be called after joinRoom 
    logger: {// Custom logs, optional. If not, use the console api 
        info: console.log, 
        error: console.error, 
        warn: console.warn, 
    }, 
    options: { 
        syncOpt: { 
            /** Synchronization interval duration,ms, recommended for low performance terminals, not less than 500ms **/ 
            interval: 1000, 
        }, 
        canvasOpt: { 
            contextType: ECanvasContextType.Canvas2d 
        } 
    } 
} 
); 
```
 
### Activate 

Activate the plugin by calling the room.setMemberState method, and modify the pen type by using the strokeType, strokeOpacity, strokeColor, useLaserPen and other attributes. 

```js 
room.setMemberState({currentApplianceName: ApplianceNames.pencil}); 
 
// For example, turn on pen draw 
room.setMemberState({currentApplianceName: ApplianceNames.pencil, strokeType: EStrokeType.Stroke, strokeOpacity:1}); 
// For example, turn on the laser pointer 
room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: true, strokeType: EStrokeType.Normal}); 
```
 
If it cannot be activated, it is necessary to introduce style.css in app.tsx or index.js. The purpose of this css is to raise the canvas level in BezierPencilDisplayer so that the event event can bubble onto the canvas. 

```js 
import '@hqer/bezier-pencil-plugin/dist/style.css' 
```