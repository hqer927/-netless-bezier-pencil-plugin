# bezier-pencil-plugin

该插件依附于 white-web-sdk 的插件机制, 实现了一套白板的教具，状态同步\回放\场景切换等功能还是依赖于white-web-sdk或window-manager。

## 简介

一个基于SpriteJS作为渲染引擎的白板铅笔绘制插件。

example 文件夹下实现了以下两种方式的demo,仅供参考.
| 场景      | demo路径     | 必要依赖      | 
| :---      |    :----:   | :---   |
| 多窗口     | example/src/multi.ts    | @netless/window-manager、white-web-sdk |
| 单白板     | example/src/single.ts    | white-web-sdk |
<!-- | fastboard | todo    | todo | -->

## 原理

1. 该插件主要是基于SpriteJS的2D功能,支持 webgl2 渲染，并可向后兼容降级为 webgl 和 canvas2d
2. 该插件通过双webWorker+offscreenCanvas机制,把绘制计算+渲染逻辑都放在独立的worker线程中处理.不占用主线程的cpu任务.

## 插件用法

### 安装

```bash
npm install @netless/appliance-plugin
```

### 注册插件

插件可以支持两种场景,它们接入插件命名不同:
- 多窗口 `ApplianceMultiPlugin`
```js
import { ApplianceMultiPlugin } from '@netless/appliance-plugin';
```
- 单白板 `ApplianceSinglePlugin`
```js
import { ApplianceSinglePlugin } from '@netless/appliance-plugin';
```

> **workerjs文件cdn部署**
>
>我们采用双worker并发来提高绘制效率,这样让它比单线程效率提高了40%以上.但是两个worker文件上的公共依赖都是重复的,所以如果直接构建到包中,那么会大大增加包体积.所以我们允许workerjs文件cdn部署,只要把@netless/appliance-plugin/cdn下的文件部署到cdn中即可,然后通过插件中的getInstance的第二个参数options.cdn中配置上两个workerjs的cdn地址即可.这样就可以解决包体积过大的问题.
>
> - **总包大概在300kB,两个wokerjs各有600kB.** 如果需要考虑构建的包体积大小的,请选择配置cdn.

### 接入方式参考

#### 多窗口模式(对接window-manager)
```js
import '@netless/window-manager/dist/style.css';
import '@netless/appliance-plugin/dist/style.css';
import { WhiteWebSdk } from "white-web-sdk";
import { WindowManager } from "@netless/window-manager";
// 全打包
import { ApplianceMultiPlugin } from '@netless/appliance-plugin';
// 以下步骤可选, 如果走cdn,可以不用从dist中引入,如果从dist中引入,需要以资源引入并通过bolb内联形式配置到options.cdn中.如?raw,这个需要打包器的支持,vite默认支持?raw,webpack需要配置.
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
#### 单白板(对接white-web-sdk)
```js
import { WhiteWebSdk } from "white-web-sdk";
// 全打包
import { ApplianceSinglePlugin, ApplianceSigleWrapper } from '@netless/appliance-plugin';
// 以下步骤可选, 如果走cdn,可以不用从dist中引入,如果从dist中引入,需要以资源引入并通过bolb内联形式配置到options.cdn中.如?raw,这个需要打包器的支持,vite默认支持?raw,webpack需要配置.
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
#### 关于?raw的webpack配置
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

### 调用介绍
插件重新实现了一些room或window或manager上的同名接口,如果不使用插件上的接口,是不能得到相应的预期效果的.但是我们可以通过``injectMethodToObject`` 重新注入回原来的对象中,从而获得插件的预期效果.如以下几个:
1. room上接口
- `setMemberState`
- `undo`
- `redo`
- `callbacks`
- `insertImage`
- `lockImage`
- `completeImageUpload`
- `getImagesInformation`
- `cleanCurrentScene`

2. windowmanager上接口
- `cleanCurrentScene`

3. windowmanager的mainview上的接口
- `setMemberState`
- `undo`
- `redo`
- `callbacks`
- `insertImage`
- `lockImage`
- `completeImageUpload`
- `getImagesInformation`
- `cleanCurrentScene`

4. 自定义
- `getBoundingRectAsync`
- `screenshotToCanvasAsync`
- `scenePreviewAsync`
- `destroy`

