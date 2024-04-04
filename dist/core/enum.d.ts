export declare enum EToolsKey {
    /** 铅笔绘制工具 */
    Pencil = 1,
    /** 橡皮擦工具 */
    Eraser = 2,
    /** 选择工具 */
    Selector = 3,
    /** 点击互动工具 */
    Clicker = 4,
    /** 箭头工具 */
    Arrow = 5,
    /** 抓手工具 */
    Hand = 6,
    /** 激光铅笔绘制工具 */
    LaserPen = 7,
    /** 文字工具 */
    Text = 8,
    /** 直线工具 */
    Straight = 9,
    /** 矩形工具 */
    Rectangle = 10,
    /** 圆形工具 */
    Ellipse = 11,
    /** 星形工具 */
    Star = 12,
    /** 三角形工具 */
    Triangle = 13,
    /** 菱形工具 */
    Rhombus = 14,
    /** 多边形工具 */
    Polygon = 15,
    /** 聊天泡泡框 */
    SpeechBalloon = 16
}
export declare enum EDataType {
    /** 本地数据 */
    Local = 1,
    /** 服务端数据 */
    Service = 2,
    /** 来源于worker */
    Worker = 3
}
export declare enum EvevtWorkState {
    Pending = 0,
    Start = 1,
    Doing = 2,
    Done = 3,
    Freeze = 4,
    Unwritable = 5
}
/**
 * 消息变化顺序: init => Scene事件 => work事件 => node事件
 * 本地数据: Init、Transform、UpdateTools
 * 服务端数据:
 */
export declare enum EPostMessageType {
    /** 初始化,仅用于本地 */
    Init = 0,
    /** 本地视口切换,仅用于本地 */
    UpdateCamera = 1,
    /** 更新tool配置数据,仅用于本地 */
    UpdateTools = 2,
    /** 创建一次work */
    CreateWork = 3,
    /** 绘制当次work（高频） */
    DrawWork = 4,
    /** 完成完整的一次work */
    FullWork = 5,
    /** 更新已有node */
    UpdateNode = 6,
    /** 删除node */
    RemoveNode = 7,
    /** 清空 */
    Clear = 8,
    /** 选中 */
    Select = 9,
    /** 销毁 */
    Destroy = 10,
    /** 什么也不需要做 */
    None = 11,
    /** 获取指定场景快照 */
    Snapshot = 12,
    /** 获取指定场所有元素的的包围盒 */
    BoundingBox = 13,
    /**  */
    Cursor = 14,
    /** */
    TextUpdate = 15,
    /**  */
    GetTextActive = 16,
    /** 批量队列化处理 */
    TasksQueue = 17
}
export declare enum ECanvasContextType {
    Webgl2 = "webgl2",
    Webgl = "webgl",
    Canvas2d = "2d"
}
export declare enum ECanvasShowType {
    Float = 1,
    Bg = 2,
    Selector = 3,
    None = 4
}
export declare enum EventMessageType {
    /** cursor事件 */
    Cursor = 1,
    /** 创建text编辑器 */
    TextCreate = 2
}
export declare enum ElayerType {
    Top = 1,
    Bottom = 2
}
export declare enum EScaleType {
    /** 不可以拉伸 */
    none = 1,
    /** 八个方向都可以拉伸 */
    all = 2,
    /** 两个方向拉伸 */
    both = 3
}
