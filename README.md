 # bezier-pencil-plugin 
 
[中文文档](https://github.com/hqer927/-netless-bezier-pencil-plugin/blob/main/READMA.zh-CN.md)

The plug-in is attached to the plug-in mechanism of white-web-sdk, and encapsulates Bessel pencil drawing as a whiteboard custom invisible plug-in type. All status synchronization is synchronized by the attributes of the plug-in to realize status synchronization between users. 
 
In the example folder, the plug-in is imported as a dependency. You can use the access method in the example folder to access the whiteboard. 
 
## Introduction 
 
A whiteboard pencil drawing plugin based on SpriteJS as a rendering engine. 
 
## Principle 
 
1. This plug-in is mainly implemented based on the Path class of SpriteJS. The function of drawing Bezier curve is realized through the Path class, and the transition animation of laser pointer is realized through the transition. 
2. The plugin uses the dual worker+offscreenCanvas mechanism to process the drawing calculation + rendering logic in an independent worker thread. Achieved high performance optimization. 
 
## Plugin usage 
 
### Install 
 
```bash 
npm install @hqer/bezier-pencil-plugin 
```
 
### Sign up for plugins 
 
```js 
import { WhiteWebSdk, DeviceType} from "white-web-sdk"; 
import { BezierPencilPlugin, BezierPencilDisplayer, ECanvasContextType } from "@hqer/bezier-pencil-plugin"; 
import '@hqer/bezier-pencil-plugin/dist/style.css' 
 
const whiteWebSdk = new WhiteWebSdk({ 
    ... 
    useMobXState: true, 
} 
const room = await whiteWebSdk.joinRoom({ 
    ... 
    isWritable: true, 
    invisiblePlugins: [BezierPencilPlugin], 
    wrappedComponents: [BezierPencilDisplayer] 
}) 
const plugin = await BezierPencilPlugin.getInstance(room, 
    {// Get plug-in instance, there should be only one plug-in instance globally, which must be called after joinRoom 
        logger: {// Custom logs, optional. If not, use the console api 
            info: console.log, 
            error: console.error, 
            warn: console.warn, 
        }, 
        options: { 
            syncOpt: { 
                /**Synchronization interval duration,ms, recommended for low performance terminals, not less than 500ms**/ 
                interval: 500, 
            }, 
            canvasOpt: { 
                /**Plugin supported rendering engine**/ 
                contextType: ECanvasContextType.Canvas2d 
            } 
        } 
    } 
); 
```
 
### Use 
 
#### 1. By extending the interface on room. 
For example, ``room.setMemberState({currentApplianceName: ApplianceNames.pencil, useNewPencil:true})`` will activate the new pencil drawing tool. It will also be possible to modify the opacity by using the ``strokeType, strokeOpacity, strokeColor, useLaserPen`` and other attributes. 
 
The specific effects are as follows: 

**Turn on Pen Tip effect**: 
```js 
room.setMemberState({currentApplianceName: ApplianceNames.pencil, useNewPencil:true, strokeType: EStrokeType.Stroke, strokeOpacity:1} as any); 
```
**Turn on Laser pointer effect**: 
```js 
room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: true, strokeType: EStrokeType.Normal} as any); 
```
#### 2. Invoke the interface on the plugin object of the plug-in instance. 
```js 
const plugin = await BezierPencilPlugin.getInstance(room,...) 
```
 
Specific effects are as follows 
 
**Empty the canvas**: 
```js 
plugin.cleanCurrentScene(); 
```
 
**Save notes as pictures**: 
```js 
const canvas = document.createElement("canvas"); 
const context = canvas.getContext("2d"); 
const { width, height, ... camera } = room.state.cameraState; 
canvas.width = width; 
canvas.height = height; 
f (context) { 
await plugin.screenshotToCanvasAsync(context, 
room.state.sceneState.scenePath, 
width, height, camera, window.devicePixelRatio); 
canvas.toBlob(this.blobCallback("download"), "image/png"); 
} 
```
 
**Undo/Restore**
```js 
// Cancel 
plugin.undo(); 
 
 
// Restore 
plugin.redo(); 
 
 
// Listen for the onCanUndoStepsUpdate event 
plugin.callbacks.on("onCanUndoStepsUpdate", (step: number): void => { 
    console.log('onCanUndoStepsUpdate', step) 
}); 
 
 
// Listen for the onCanRedoStepsUpdate event 
plugin.callbacks.on("onCanRedoStepsUpdate", (step: number): void => { 
    console.log('onCanRedoStepsUpdate', step) 
}); 
```
