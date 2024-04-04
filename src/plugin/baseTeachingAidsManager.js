import EventEmitter2 from "eventemitter2";
import { EStrokeType, ShapeType } from "./types";
import { Collector } from "../collector";
import { RoomMemberManager } from "../members";
import { TextEditorManagerImpl } from "../component/textEditor";
import { ApplianceNames, isRoom, toJS } from "white-web-sdk";
import { CursorManagerImpl } from "../cursors";
import { MasterControlForWorker } from "../core/mainEngine";
import { EToolsKey } from "../core/enum";
import { rgbToRgba } from "../collector/utils/color";
import throttle from "lodash/throttle";
/** 插件管理器 */
export class BaseTeachingAidsManager {
    constructor(plugin, options) {
        Object.defineProperty(this, "plugin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "room", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pluginOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roomMember", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cursor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textEditorManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** 监听路径变化 */
        Object.defineProperty(this, "onSceneChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (scenePath, viewId) => {
                // console.log('onSceneChange', scenePath, viewId)
                const curFocusScenePath = this.viewContainerManager.getView(viewId)?.focusScenePath;
                curFocusScenePath && this.worker.blurSelector(viewId, curFocusScenePath);
                const focusScenePath = scenePath;
                if (focusScenePath) {
                    this.viewContainerManager.setViewScenePath(viewId, focusScenePath);
                }
            }
        });
        /** 监听房间成员变化 */
        Object.defineProperty(this, "onRoomMembersChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (roomMembers) => {
                this.roomMember.setRoomMembers(toJS(roomMembers));
            }
        });
        /** 监听房间教具变更 */
        Object.defineProperty(this, "onMemberChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: throttle((memberState) => {
                if (!this.room || !this.worker) {
                    return;
                }
                const toolsKey = this.getToolsKey(memberState);
                const toolsInfo = this.getToolsOpt(toolsKey, memberState);
                this.worker.setCurrentToolsData(toolsInfo);
                this.effectViewContainer(toolsKey);
            }, 100, { 'leading': false })
        });
        Object.defineProperty(this, "internalSceneChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (viewId, scenePath) => {
                // console.log('internalSceneChange', viewId, scenePath)
                this.worker?.clearViewScenePath(viewId, true).then(() => {
                    this.worker?.pullServiceData(viewId, scenePath);
                });
            }
        });
        Object.defineProperty(this, "internalCameraChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (viewId, cameraOpt) => {
                this.worker?.updateCamera(viewId, cameraOpt);
            }
        });
        this.plugin = plugin;
        this.room = isRoom(plugin.displayer) ? plugin.displayer : undefined;
        this.pluginOptions = options;
        this.roomMember = new RoomMemberManager();
        this.collector = new Collector(plugin, this.pluginOptions?.syncOpt?.interval);
        const props = {
            control: this,
            internalMsgEmitter: BaseTeachingAidsManager.InternalMsgEmitter
        };
        this.cursor = new CursorManagerImpl(props);
        this.textEditorManager = new TextEditorManagerImpl(props);
        this.worker = new MasterControlForWorker(props);
    }
    /** 销毁 */
    destroy() {
        this.roomMember.destroy();
        this.collector?.destroy();
        this.worker?.destroy();
        this.viewContainerManager?.destroy();
        this.cursor?.destroy();
        this.textEditorManager?.destory();
    }
    /** 清空当前获焦路径下的所有内容 */
    cleanCurrentScene() {
        // this.plugin?.updateAttributes(['PluginState'], undefined);
        const undoTickerId = Date.now();
        const viewId = this.viewContainerManager.focuedViewId;
        if (viewId) {
            BaseTeachingAidsManager.InternalMsgEmitter.emit('undoTickerStart', undoTickerId, viewId);
            this.worker.clearViewScenePath(viewId).then(() => {
                BaseTeachingAidsManager.InternalMsgEmitter.emit('undoTickerEnd', undoTickerId, viewId);
            });
        }
    }
    /** 监听读写状态变更 */
    onWritableChange(isWritable) {
        if (!isWritable) {
            this.worker?.unabled();
        }
        else {
            this.worker?.abled();
        }
    }
    /** 获取当前工具key */
    getToolsKey(memberState) {
        const currentApplianceName = memberState.currentApplianceName;
        switch (currentApplianceName) {
            case ApplianceNames.text:
                return EToolsKey.Text;
            case ApplianceNames.pencil:
                if (memberState.useNewPencil) {
                    return EToolsKey.Pencil;
                }
                if (memberState.useLaserPen) {
                    return EToolsKey.LaserPen;
                }
                break;
            case ApplianceNames.eraser:
            case ApplianceNames.pencilEraser:
                return EToolsKey.Eraser;
            case ApplianceNames.selector:
                return EToolsKey.Selector;
            case ApplianceNames.arrow:
                return EToolsKey.Arrow;
            case ApplianceNames.straight:
                return EToolsKey.Straight;
            case ApplianceNames.ellipse:
                return EToolsKey.Ellipse;
            case ApplianceNames.rectangle:
                return EToolsKey.Rectangle;
            case ApplianceNames.shape:
                if (memberState.shapeType === ShapeType.Pentagram ||
                    memberState.shapeType === ShapeType.Star) {
                    return EToolsKey.Star;
                }
                if (memberState.shapeType === ShapeType.Polygon ||
                    memberState.shapeType === ShapeType.Triangle ||
                    memberState.shapeType === ShapeType.Rhombus) {
                    return EToolsKey.Polygon;
                }
                if (memberState.shapeType === ShapeType.SpeechBalloon) {
                    return EToolsKey.SpeechBalloon;
                }
                break;
        }
        return EToolsKey.Clicker;
    }
    /** 获取当前工具默认配置 */
    getToolsOpt(toolsKey, memberState) {
        const currentApplianceName = memberState.currentApplianceName;
        const opt = {
            strokeColor: rgbToRgba(memberState.strokeColor[0], memberState.strokeColor[1], memberState.strokeColor[2], memberState.strokeOpacity || 1),
            thickness: memberState.strokeWidth,
            isOpacity: (memberState?.strokeOpacity && memberState.strokeOpacity < 1) ||
                (memberState?.fillOpacity && memberState.fillOpacity < 1) ||
                (memberState?.textOpacity && memberState.textOpacity < 1) ||
                (memberState?.textBgOpacity && memberState.textBgOpacity < 1) || false,
        };
        switch (toolsKey) {
            case EToolsKey.Text:
                opt.fontSize = memberState?.textSize || Number(window.getComputedStyle(document.body).fontSize);
                opt.textAlign = memberState?.textAlign || 'left';
                opt.verticalAlign = memberState?.verticalAlign || 'middle';
                opt.fontColor = memberState?.textColor && rgbToRgba(memberState.textColor[0], memberState.textColor[1], memberState.textColor[2], memberState.textOpacity || 1) || opt.strokeColor || 'rgba(0,0,0,1)';
                opt.fontBgColor = Array.isArray(memberState?.textBgColor) && rgbToRgba(memberState.textBgColor[0], memberState.textBgColor[1], memberState.textBgColor[2], memberState.textBgOpacity || 1) || 'transparent';
                opt.fontWeight = memberState?.bold && 'bold' || undefined;
                opt.fontStyle = memberState?.italic && 'italic' || undefined;
                opt.underline = memberState?.underline || undefined;
                opt.lineThrough = memberState?.lineThrough || undefined;
                opt.text = "";
                opt.strokeColor = undefined;
                break;
            case EToolsKey.Pencil:
                opt.strokeType = memberState?.strokeType || EStrokeType.Normal;
                break;
            case EToolsKey.Eraser:
                opt.thickness = Math.min(3, Math.max(1, Math.floor(memberState.pencilEraserSize || 1))) - 1;
                opt.isLine = currentApplianceName === ApplianceNames.eraser && true;
                break;
            case EToolsKey.LaserPen:
                opt.duration = memberState?.duration || 1;
                opt.strokeType = memberState?.strokeType || EStrokeType.Normal;
                break;
            case EToolsKey.Ellipse:
            case EToolsKey.Rectangle:
            case EToolsKey.Star:
            case EToolsKey.Polygon:
            case EToolsKey.SpeechBalloon:
                if (toolsKey === EToolsKey.Star) {
                    if (memberState.shapeType === ShapeType.SpeechBalloon) {
                        opt.placement = 'bottomLeft';
                    }
                    else if (memberState.shapeType === ShapeType.Pentagram) {
                        opt.vertices = 10;
                        opt.innerVerticeStep = 2;
                        opt.innerRatio = 0.4;
                    }
                    else if (memberState?.vertices && memberState?.innerVerticeStep && memberState?.innerRatio) {
                        opt.vertices = memberState.vertices;
                        opt.innerVerticeStep = memberState.innerVerticeStep;
                        opt.innerRatio = memberState.innerRatio;
                    }
                }
                if (toolsKey === EToolsKey.Polygon) {
                    if (memberState.shapeType === ShapeType.Triangle) {
                        opt.vertices = 3;
                    }
                    else if (memberState.shapeType === ShapeType.Rhombus) {
                        opt.vertices = 4;
                    }
                    else if (memberState.vertices) {
                        opt.vertices = memberState.vertices;
                    }
                }
                opt.fillColor = memberState?.fillColor && rgbToRgba(memberState.fillColor[0], memberState.fillColor[1], memberState.fillColor[2], memberState?.fillOpacity) || 'transparent';
                if (toolsKey !== EToolsKey.Rectangle) {
                    opt.textOpt = {
                        strokeColor: opt.strokeColor,
                        fontSize: memberState?.textSize || Number(window.getComputedStyle(document.body).fontSize),
                        textAlign: memberState?.textAlign || 'left',
                        verticalAlign: memberState?.verticalAlign || 'middle',
                        fontColor: memberState?.textColor && rgbToRgba(memberState.textColor[0], memberState.textColor[1], memberState.textColor[2], memberState.textOpacity || 1) || 'rgba(0,0,0,1)',
                        fontBgColor: Array.isArray(memberState?.textBgColor) && rgbToRgba(memberState.textBgColor[0], memberState.textBgColor[1], memberState.textBgColor[2], memberState.textBgOpacity || 1) || 'transparent',
                        fontWeight: memberState?.bold && 'bold' || undefined,
                        fontStyle: memberState?.italic && 'italic' || undefined,
                        underline: memberState?.underline || undefined,
                        lineThrough: memberState?.lineThrough || undefined,
                        text: ''
                    };
                }
                break;
            default:
                break;
        }
        return {
            toolsType: toolsKey,
            toolsOpt: opt,
        };
    }
    /** 激活当前view容器*/
    effectViewContainer(toolsKey) {
        switch (toolsKey) {
            case EToolsKey.Text:
            case EToolsKey.Pencil:
            case EToolsKey.LaserPen:
            case EToolsKey.Arrow:
            case EToolsKey.Straight:
            case EToolsKey.Rectangle:
            case EToolsKey.Ellipse:
            case EToolsKey.Star:
            case EToolsKey.Polygon:
            case EToolsKey.SpeechBalloon:
                this.room.disableDeviceInputs = true;
                this.worker?.abled();
                setTimeout(() => {
                    const views = this.viewContainerManager.getAllViews();
                    views.forEach(view => {
                        if (view?.displayer) {
                            view.displayer.bindToolsClass();
                        }
                    });
                }, 0);
                break;
            case EToolsKey.Eraser:
            case EToolsKey.Selector:
                this.room.disableDeviceInputs = false;
                this.cursor?.unable();
                this.worker?.abled();
                break;
            default:
                this.room.disableDeviceInputs = false;
                this.worker?.unabled();
                this.cursor?.unable();
                break;
        }
    }
    /** 异步获取指定路径下绘制内容的区域大小 */
    async getBoundingRect(scenePath) {
        const rect = await this.worker?.getBoundingRect(scenePath);
        if (rect) {
            return {
                width: rect.w,
                height: rect.h,
                originX: rect.x,
                originY: rect.y,
            };
        }
    }
    /** 异步获取指定路径下的的快照并绘制到指定的画布上 */
    async screenshotToCanvas(context, scenePath, width, height, camera) {
        const imageBitmap = await this.worker.getSnapshot(scenePath, width, height, camera);
        if (imageBitmap) {
            context.drawImage(imageBitmap, 0, 0);
            imageBitmap.close();
        }
    }
    /** 异步获取指定路径下的缩略图 */
    async scenePreview(scenePath, img) {
        const viewId = this.collector.getViewIdBySecenPath(scenePath);
        if (!viewId) {
            return;
        }
        const view = this.viewContainerManager.getView(viewId);
        if (!view || !view.cameraOpt?.width || !view.cameraOpt?.height) {
            return;
        }
        const imageBitmap = await this.worker?.getSnapshot(scenePath);
        if (imageBitmap && this.worker) {
            const canvas = document.createElement("canvas");
            const limitContext = canvas.getContext("2d");
            const { width, height } = view.cameraOpt;
            canvas.width = width;
            canvas.height = height;
            if (limitContext) {
                limitContext.drawImage(imageBitmap, 0, 0);
                img.src = canvas.toDataURL();
                img.onload = () => {
                    canvas.remove();
                };
                img.onerror = () => {
                    canvas.remove();
                    img.remove();
                };
            }
            imageBitmap.close();
        }
    }
}
Object.defineProperty(BaseTeachingAidsManager, "InternalMsgEmitter", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new EventEmitter2()
});
