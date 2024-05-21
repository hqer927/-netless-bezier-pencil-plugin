export var EToolsKey;
(function (EToolsKey) {
    /** 铅笔绘制工具 */
    EToolsKey[EToolsKey["Pencil"] = 1] = "Pencil";
    /** 橡皮擦工具 */
    EToolsKey[EToolsKey["Eraser"] = 2] = "Eraser";
    /** 选择工具 */
    EToolsKey[EToolsKey["Selector"] = 3] = "Selector";
    /** 点击互动工具 */
    EToolsKey[EToolsKey["Clicker"] = 4] = "Clicker";
    /** 箭头工具 */
    EToolsKey[EToolsKey["Arrow"] = 5] = "Arrow";
    /** 抓手工具 */
    EToolsKey[EToolsKey["Hand"] = 6] = "Hand";
    /** 激光铅笔绘制工具 */
    EToolsKey[EToolsKey["LaserPen"] = 7] = "LaserPen";
    /** 文字工具 */
    EToolsKey[EToolsKey["Text"] = 8] = "Text";
    /** 直线工具 */
    EToolsKey[EToolsKey["Straight"] = 9] = "Straight";
    /** 矩形工具 */
    EToolsKey[EToolsKey["Rectangle"] = 10] = "Rectangle";
    /** 圆形工具 */
    EToolsKey[EToolsKey["Ellipse"] = 11] = "Ellipse";
    /** 星形工具 */
    EToolsKey[EToolsKey["Star"] = 12] = "Star";
    /** 三角形工具 */
    EToolsKey[EToolsKey["Triangle"] = 13] = "Triangle";
    /** 菱形工具 */
    EToolsKey[EToolsKey["Rhombus"] = 14] = "Rhombus";
    /** 多边形工具 */
    EToolsKey[EToolsKey["Polygon"] = 15] = "Polygon";
    /** 聊天泡泡框 */
    EToolsKey[EToolsKey["SpeechBalloon"] = 16] = "SpeechBalloon";
    /** 图片 */
    EToolsKey[EToolsKey["Image"] = 17] = "Image";
})(EToolsKey || (EToolsKey = {}));
export var EDataType;
(function (EDataType) {
    /** 本地数据 */
    EDataType[EDataType["Local"] = 1] = "Local";
    /** 服务端数据 */
    EDataType[EDataType["Service"] = 2] = "Service";
    /** 来源于worker */
    EDataType[EDataType["Worker"] = 3] = "Worker";
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
    /** 什么也不需要做 */
    EPostMessageType[EPostMessageType["None"] = 0] = "None";
    /** 初始化,仅用于本地 */
    EPostMessageType[EPostMessageType["Init"] = 1] = "Init";
    /** 本地视口切换,仅用于本地 */
    EPostMessageType[EPostMessageType["UpdateCamera"] = 2] = "UpdateCamera";
    /** 更新tool配置数据,仅用于本地 */
    EPostMessageType[EPostMessageType["UpdateTools"] = 3] = "UpdateTools";
    /** 创建一次work */
    EPostMessageType[EPostMessageType["CreateWork"] = 4] = "CreateWork";
    /** 绘制当次work（高频） */
    EPostMessageType[EPostMessageType["DrawWork"] = 5] = "DrawWork";
    /** 完成完整的一次work */
    EPostMessageType[EPostMessageType["FullWork"] = 6] = "FullWork";
    /** 更新已有node */
    EPostMessageType[EPostMessageType["UpdateNode"] = 7] = "UpdateNode";
    /** 删除node */
    EPostMessageType[EPostMessageType["RemoveNode"] = 8] = "RemoveNode";
    /** 清空 */
    EPostMessageType[EPostMessageType["Clear"] = 9] = "Clear";
    /** 选中 */
    EPostMessageType[EPostMessageType["Select"] = 10] = "Select";
    /** 销毁 */
    EPostMessageType[EPostMessageType["Destroy"] = 11] = "Destroy";
    /** 获取指定场景快照 */
    EPostMessageType[EPostMessageType["Snapshot"] = 12] = "Snapshot";
    /** 获取指定场所有元素的的包围盒 */
    EPostMessageType[EPostMessageType["BoundingBox"] = 13] = "BoundingBox";
    /** 指针事件 */
    EPostMessageType[EPostMessageType["Cursor"] = 14] = "Cursor";
    /** 更新文本 */
    EPostMessageType[EPostMessageType["TextUpdate"] = 15] = "TextUpdate";
    /** 获取获奖的文本信息 */
    EPostMessageType[EPostMessageType["GetTextActive"] = 16] = "GetTextActive";
    /** 批量队列化处理 */
    EPostMessageType[EPostMessageType["TasksQueue"] = 17] = "TasksQueue";
    /** 指针hover元素事件 */
    EPostMessageType[EPostMessageType["CursorHover"] = 18] = "CursorHover";
})(EPostMessageType || (EPostMessageType = {}));
export var ECanvasContextType;
(function (ECanvasContextType) {
    ECanvasContextType["Webgl2"] = "webgl2";
    ECanvasContextType["Webgl"] = "webgl";
    ECanvasContextType["Canvas2d"] = "2d";
})(ECanvasContextType || (ECanvasContextType = {}));
export var ECanvasShowType;
(function (ECanvasShowType) {
    /** 本地前置画布 */
    ECanvasShowType[ECanvasShowType["Float"] = 1] = "Float";
    /** 背景画布 */
    ECanvasShowType[ECanvasShowType["Bg"] = 2] = "Bg";
    /** 选择框中的画布 */
    ECanvasShowType[ECanvasShowType["Selector"] = 3] = "Selector";
    /** 服务端前置画布 */
    ECanvasShowType[ECanvasShowType["ServiceFloat"] = 4] = "ServiceFloat";
    ECanvasShowType[ECanvasShowType["None"] = 5] = "None";
})(ECanvasShowType || (ECanvasShowType = {}));
export var EventMessageType;
(function (EventMessageType) {
    /** cursor事件 */
    EventMessageType[EventMessageType["Cursor"] = 1] = "Cursor";
    /** 创建text编辑器 */
    EventMessageType[EventMessageType["TextCreate"] = 2] = "TextCreate";
})(EventMessageType || (EventMessageType = {}));
export var ElayerType;
(function (ElayerType) {
    ElayerType[ElayerType["Top"] = 1] = "Top";
    ElayerType[ElayerType["Bottom"] = 2] = "Bottom";
})(ElayerType || (ElayerType = {}));
export var EScaleType;
(function (EScaleType) {
    /** 不可以拉伸 */
    EScaleType[EScaleType["none"] = 1] = "none";
    /** 八个方向都可以拉伸 */
    EScaleType[EScaleType["all"] = 2] = "all";
    /** 两个方向拉伸 */
    EScaleType[EScaleType["both"] = 3] = "both";
    /** 等比例 */
    EScaleType[EScaleType["proportional"] = 4] = "proportional";
})(EScaleType || (EScaleType = {}));
