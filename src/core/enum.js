export var EToolsKey;
(function (EToolsKey) {
    EToolsKey[EToolsKey["Pencil"] = 1] = "Pencil";
    EToolsKey[EToolsKey["Eraser"] = 2] = "Eraser";
    EToolsKey[EToolsKey["Selector"] = 3] = "Selector";
    EToolsKey[EToolsKey["Clicker"] = 4] = "Clicker";
    EToolsKey[EToolsKey["Arrow"] = 5] = "Arrow";
    EToolsKey[EToolsKey["Hand"] = 6] = "Hand";
    EToolsKey[EToolsKey["LaserPen"] = 7] = "LaserPen";
})(EToolsKey || (EToolsKey = {}));
export var ESpriteNodeKey;
(function (ESpriteNodeKey) {
    ESpriteNodeKey[ESpriteNodeKey["Path"] = 0] = "Path";
    ESpriteNodeKey[ESpriteNodeKey["Rect"] = 1] = "Rect";
})(ESpriteNodeKey || (ESpriteNodeKey = {}));
export var EDataType;
(function (EDataType) {
    /** 本地数据 */
    EDataType[EDataType["Local"] = 1] = "Local";
    /** 服务端数据 */
    EDataType[EDataType["Service"] = 2] = "Service";
})(EDataType || (EDataType = {}));
export var EvevtWorkState;
(function (EvevtWorkState) {
    EvevtWorkState[EvevtWorkState["Pending"] = 0] = "Pending";
    EvevtWorkState[EvevtWorkState["Start"] = 1] = "Start";
    EvevtWorkState[EvevtWorkState["Doing"] = 2] = "Doing";
    EvevtWorkState[EvevtWorkState["Done"] = 3] = "Done";
    EvevtWorkState[EvevtWorkState["Freeze"] = 4] = "Freeze";
    EvevtWorkState[EvevtWorkState["Unwritable"] = 5] = "Unwritable";
})(EvevtWorkState || (EvevtWorkState = {}));
/**
 * 消息变化顺序: init => Scene事件 => work事件 => node事件
 * 本地数据: Init、Transform、UpdateTools、CombineDraw
 * 服务端数据:
 */
export var EPostMessageType;
(function (EPostMessageType) {
    /** 初始化,仅用于本地 */
    EPostMessageType[EPostMessageType["Init"] = 0] = "Init";
    /** 本地动画,仅用于本地 */
    EPostMessageType[EPostMessageType["Transform"] = 1] = "Transform";
    /** 更新tool配置数据,仅用于本地 */
    EPostMessageType[EPostMessageType["UpdateTools"] = 2] = "UpdateTools";
    /** 更新offScene配置数据 */
    EPostMessageType[EPostMessageType["UpdateScene"] = 3] = "UpdateScene";
    /** 创建一次work */
    EPostMessageType[EPostMessageType["CreateWork"] = 4] = "CreateWork";
    /** 绘制当次work（高频） */
    EPostMessageType[EPostMessageType["DrawWork"] = 5] = "DrawWork";
    /** 完成完整的一次work */
    EPostMessageType[EPostMessageType["FullWork"] = 6] = "FullWork";
    /** 更新work配置数据 */
    EPostMessageType[EPostMessageType["UpdateWork"] = 7] = "UpdateWork";
    /** 更新已有node */
    EPostMessageType[EPostMessageType["UpdateNode"] = 8] = "UpdateNode";
    /** 删除node */
    EPostMessageType[EPostMessageType["RemoveNode"] = 9] = "RemoveNode";
    /** 清空 */
    EPostMessageType[EPostMessageType["Clear"] = 10] = "Clear";
    /** 选中 */
    EPostMessageType[EPostMessageType["Select"] = 11] = "Select";
    /** 销毁 */
    EPostMessageType[EPostMessageType["Destroy"] = 12] = "Destroy";
    /** 什么也不需要做 */
    EPostMessageType[EPostMessageType["None"] = 13] = "None";
    /** 合并绘制 */
    EPostMessageType[EPostMessageType["CombineDraw"] = 14] = "CombineDraw";
})(EPostMessageType || (EPostMessageType = {}));
export var EShapeDataTypeKey;
(function (EShapeDataTypeKey) {
    EShapeDataTypeKey[EShapeDataTypeKey["Path"] = 0] = "Path";
    EShapeDataTypeKey[EShapeDataTypeKey["Rect"] = 1] = "Rect";
    EShapeDataTypeKey[EShapeDataTypeKey["Texture"] = 2] = "Texture";
})(EShapeDataTypeKey || (EShapeDataTypeKey = {}));
export var ECanvasContextType;
(function (ECanvasContextType) {
    ECanvasContextType["Webgl2"] = "webgl2";
    ECanvasContextType["Webgl"] = "webgl";
    ECanvasContextType["Canvas2d"] = "2d";
})(ECanvasContextType || (ECanvasContextType = {}));
export var EanimationMode;
(function (EanimationMode) {
    EanimationMode["immediately"] = "immediately";
    EanimationMode["continuous"] = "continuous";
})(EanimationMode || (EanimationMode = {}));
export var ECanvasShowType;
(function (ECanvasShowType) {
    ECanvasShowType[ECanvasShowType["Float"] = 0] = "Float";
    ECanvasShowType[ECanvasShowType["Bg"] = 1] = "Bg";
})(ECanvasShowType || (ECanvasShowType = {}));
