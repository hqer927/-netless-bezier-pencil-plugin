# bezier-pencil-plugin

该插件依附于 white-web-sdk 的插件机制,将贝塞尔铅笔绘制作为白板自定义不可见插件类型进行封装，所有状态同步都交由插件的attributes进行同步以实现各用户间的状态同步。

example 文件夹下是将该插件作为依赖引入，用户可以参考该文件夹下接入方式接入白板.

## 简介

一个基于SpriteJS作为渲染引擎的白板铅笔绘制插件。

## 原理

1. 该插件主要是基于SpriteJS的Path类实现,通过Path类实现了绘制贝塞尔曲线的功能,同时通过transition实现了激光笔的过渡动画.
2. 该插件通过双worker+offscreenCanvas机制,把绘制计算+渲染逻辑都放在独立的worker线程中处理.做到了高性能优化.

## 插件用法

### 安装

```bash
npm install @hqer/bezier-pencil-plugin
```

### 注册插件

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
    {   // 获取插件实例，全局应该只有一个插件实例，必须在 joinRoom 之后调用
        logger: {   // 自定义日志，可选，如果不传则使用 console api
            info: console.log,
            error: console.error,
            warn: console.warn,
        },
        options: {
            syncOpt: {
                /** 同步间隔时长,ms, 建议在低性能的终端上,不要低于500ms **/
                interval: 500,
            },
            canvasOpt: {
                /** 插件支持的渲染引擎 **/
                contextType: ECanvasContextType.Canvas2d
            }
        }
    }
);
```

### 使用

#### 1、通过扩展room上的接口.
比如:``room.setMemberState({currentApplianceName: ApplianceNames.pencil, useNewPencil:true})``,就会激活新铅笔绘制工具.其中还可以通过``strokeType、strokeOpacity、strokeColor、useLaserPen``等属性指修改画笔类型.

具体效果如下:
**开启笔锋效果**: 
```js
room.setMemberState({currentApplianceName: ApplianceNames.pencil, useNewPencil:true, strokeType: EStrokeType.Stroke, strokeOpacity:1} as any);
```
**开启激光笔效果**:
```js
room.setMemberState({currentApplianceName: ApplianceNames.pencil, useLaserPen: true, strokeType: EStrokeType.Normal} as any);
```
#### 2、调用插件实例plugin对象上接口.
```js
const plugin = await BezierPencilPlugin.getInstance(room,...)
```

具体效果如下

**清空画布**:
```js
plugin.cleanCurrentScene();
```

**保存笔记为图片**:
```js
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const { width, height, ...camera } = room.state.cameraState;
canvas.width = width;
canvas.height = height;
f (context) {
   await plugin.screenshotToCanvasAsync(context,
   room.state.sceneState.scenePath,
   width, height, camera, window.devicePixelRatio);
   canvas.toBlob(this.blobCallback("download"), "image/png");
}
```

**撤销/恢复**
```js
// 撤销
plugin.undo();


//恢复
plugin.redo();


// 监听onCanUndoStepsUpdate事件
plugin.callbacks.on("onCanUndoStepsUpdate", (step: number): void => {
	console.log('onCanUndoStepsUpdate', step)
});


// 监听onCanRedoStepsUpdate事件
plugin.callbacks.on("onCanRedoStepsUpdate", (step: number): void => {
    console.log('onCanRedoStepsUpdate', step)
});
```
