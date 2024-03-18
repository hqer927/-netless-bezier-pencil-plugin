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
 * 本地数据: Init、Transform、UpdateTools
 * 服务端数据:
 */
export var EPostMessageType;
(function (EPostMessageType) {
    /** 初始化,仅用于本地 */
    EPostMessageType[EPostMessageType["Init"] = 0] = "Init";
    /** 本地视口切换,仅用于本地 */
    EPostMessageType[EPostMessageType["UpdateCamera"] = 1] = "UpdateCamera";
    /** 更新tool配置数据,仅用于本地 */
    EPostMessageType[EPostMessageType["UpdateTools"] = 2] = "UpdateTools";
    /** 创建一次work */
    EPostMessageType[EPostMessageType["CreateWork"] = 3] = "CreateWork";
    /** 绘制当次work（高频） */
    EPostMessageType[EPostMessageType["DrawWork"] = 4] = "DrawWork";
    /** 完成完整的一次work */
    EPostMessageType[EPostMessageType["FullWork"] = 5] = "FullWork";
    /** 更新已有node */
    EPostMessageType[EPostMessageType["UpdateNode"] = 6] = "UpdateNode";
    /** 删除node */
    EPostMessageType[EPostMessageType["RemoveNode"] = 7] = "RemoveNode";
    /** 清空 */
    EPostMessageType[EPostMessageType["Clear"] = 8] = "Clear";
    /** 选中 */
    EPostMessageType[EPostMessageType["Select"] = 9] = "Select";
    /** 销毁 */
    EPostMessageType[EPostMessageType["Destroy"] = 10] = "Destroy";
    /** 什么也不需要做 */
    EPostMessageType[EPostMessageType["None"] = 11] = "None";
    /** 获取指定场景快照 */
    EPostMessageType[EPostMessageType["Snapshot"] = 12] = "Snapshot";
    /** 获取指定场所有元素的的包围盒 */
    EPostMessageType[EPostMessageType["BoundingBox"] = 13] = "BoundingBox";
    EPostMessageType[EPostMessageType["Cursor"] = 14] = "Cursor";
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
export var ECanvasShowType;
(function (ECanvasShowType) {
    ECanvasShowType[ECanvasShowType["Float"] = 1] = "Float";
    ECanvasShowType[ECanvasShowType["Bg"] = 2] = "Bg";
    ECanvasShowType[ECanvasShowType["Selector"] = 3] = "Selector";
    ECanvasShowType[ECanvasShowType["None"] = 4] = "None";
})(ECanvasShowType || (ECanvasShowType = {}));
export var EScaleDirection;
(function (EScaleDirection) {
    EScaleDirection["LT"] = "topLeft";
    EScaleDirection["LC"] = "left";
    EScaleDirection["LB"] = "bottomLeft";
    EScaleDirection["TC"] = "top";
    EScaleDirection["RT"] = "topRight";
    EScaleDirection["RC"] = "right";
    EScaleDirection["RB"] = "bottomRight";
    EScaleDirection["BC"] = "bottom";
})(EScaleDirection || (EScaleDirection = {}));
export var EventMessageType;
(function (EventMessageType) {
    /** cursor事件 */
    EventMessageType[EventMessageType["Cursor"] = 1] = "Cursor";
})(EventMessageType || (EventMessageType = {}));
export var ElayerType;
(function (ElayerType) {
    ElayerType[ElayerType["Top"] = 1] = "Top";
    ElayerType[ElayerType["Bottom"] = 2] = "Bottom";
})(ElayerType || (ElayerType = {}));
