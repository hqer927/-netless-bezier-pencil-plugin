import { InvisiblePlugin, isRoom, isPlayer, RoomPhase } from "white-web-sdk";
import { setValue, val } from "value-enhancer";
import { BezierPencilManager } from "./bezierPencilManager";
export class BezierPencilPlugin extends InvisiblePlugin {
    static async getInstance(displayer, adaptor) {
        if (adaptor?.logger) {
            BezierPencilPlugin.logger = adaptor.logger;
        }
        if (adaptor?.options) {
            BezierPencilPlugin.options = adaptor.options;
        }
        let bezierPencilPlugin = displayer.getInvisiblePlugin(BezierPencilPlugin.kind);
        if (!bezierPencilPlugin) {
            if (isRoom(displayer) && displayer.isWritable) {
                if (!displayer.isWritable) {
                    return displayer;
                }
                bezierPencilPlugin = (await displayer.createInvisiblePlugin(BezierPencilPlugin, {}));
            }
            else {
                return displayer;
            }
        }
        bezierPencilPlugin?.init(displayer);
        BezierPencilPlugin.effectInstance(displayer);
        return displayer;
    }
    /**
     * 房间实例化时，将当前实例对displayer外部API的添加内部处理逻辑;
     * @param displayer
     */
    static effectInstance(displayer) {
        const _cleanCurrentScene = displayer.cleanCurrentScene;
        displayer.cleanCurrentScene = function (retainPpt) {
            BezierPencilPlugin.currentManager.cleanCurrentScene();
            BezierPencilPlugin.logger.info(`[Projector plugin] cleanCurrentScene`);
            _cleanCurrentScene.call(displayer, retainPpt);
        };
        return displayer;
    }
    constructor(context) {
        super(context);
        Object.defineProperty(this, "onPhaseChanged", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (phase) => {
                if (phase === RoomPhase.Disconnected) {
                    this.displayer.callbacks.off(this.callbackName, this.roomStateChangeListener);
                    this.displayer.callbacks.off("onEnableWriteNowChanged", this.updateRoomWritable);
                    this.displayer.callbacks.off("onPhaseChanged", this.onPhaseChanged);
                    //   isRoomWritable$.dispose();
                    //   invisiblePlugin$.dispose();
                    BezierPencilPlugin.invisiblePlugins.delete(this.displayer);
                    BezierPencilPlugin.currentManager.destroy();
                }
            }
        });
        Object.defineProperty(this, "updateRoomWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                BezierPencilPlugin.currentManager.onWritableChange(this.displayer.isWritable);
            }
        });
        Object.defineProperty(this, "roomStateChangeListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (state) => {
                if (state.cameraState) {
                    BezierPencilPlugin.currentManager.onCameraChange(state.cameraState);
                }
                if (state.memberState) {
                    BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
                }
                if (state.sceneState) {
                    BezierPencilPlugin.currentManager.onSceneChange(state.sceneState);
                }
            }
        });
        Object.defineProperty(this, "createCurrentManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (BezierPencilPlugin.currentManager) {
                    BezierPencilPlugin.currentManager.destroy();
                }
                const bezierManager = new BezierPencilManager(this, BezierPencilPlugin.options);
                bezierManager.init();
                BezierPencilPlugin.currentManager = bezierManager;
                BezierPencilPlugin.logger.info(`[Projector plugin] refresh currentSlideManager object`);
                // return BezierPencilPlugin.currentManager;
            }
        });
        const invisiblePlugin$ = BezierPencilPlugin.invisiblePlugins.get(this.displayer);
        invisiblePlugin$ && setValue(invisiblePlugin$, this);
    }
    get isReplay() {
        return isPlayer(this.displayer);
    }
    get callbackName() {
        return this.isReplay ? "onPlayerStateChanged" : "onRoomStateChanged";
    }
    init(displayer) {
        const invisiblePlugin$ = val(displayer.getInvisiblePlugin(BezierPencilPlugin.kind));
        BezierPencilPlugin.invisiblePlugins.set(displayer, invisiblePlugin$);
        if (isRoom(displayer)) {
            this.createCurrentManager();
            const state = displayer.state;
            if (state?.memberState) {
                BezierPencilPlugin.currentManager.onMemberChange(state.memberState);
            }
        }
        this.displayer.callbacks.on(this.callbackName, this.roomStateChangeListener);
        this.displayer.callbacks.on("onEnableWriteNowChanged", this.updateRoomWritable);
        this.displayer.callbacks.on("onPhaseChanged", this.onPhaseChanged);
    }
}
// 组件类型，该组件的唯一识别符。应该取一个独特的名字，以和其他组件区分。
Object.defineProperty(BezierPencilPlugin, "kind", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "bezier-pencil-plugin"
});
Object.defineProperty(BezierPencilPlugin, "invisiblePlugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new WeakMap()
});
Object.defineProperty(BezierPencilPlugin, "logger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: console.log,
        warn: console.warn,
        error: console.error,
    }
});
