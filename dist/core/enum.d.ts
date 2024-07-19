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
    SpeechBalloon = 16,
    /** 图片 */
    Image = 17
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
    /** 只读状态 */
    Unwritable = 4
}
/**
 * 事件消息类型
 */
export declare enum EPostMessageType {
    /** 什么也不需要做 */
    None = 0,
    /** 初始化,仅用于本地 */
    Init = 1,
    /** 本地视口切换,仅用于本地 */
    UpdateCamera = 2,
    /** 更新tool配置数据,仅用于本地 */
    UpdateTools = 3,
    /** 创建一次work */
    CreateWork = 4,
    /** 绘制当次work（高频） */
    DrawWork = 5,
    /** 完成完整的一次work */
    FullWork = 6,
    /** 更新已有node */
    UpdateNode = 7,
    /** 删除node */
    RemoveNode = 8,
    /** 清空 */
    Clear = 9,
    /** 选中 */
    Select = 10,
    /** 销毁 */
    Destroy = 11,
    /** 获取指定场景快照 */
    Snapshot = 12,
    /** 获取指定场所有元素的的包围盒 */
    BoundingBox = 13,
    /** 指针事件 */
    Cursor = 14,
    /** 更新文本 */
    TextUpdate = 15,
    /** 获取获焦的文本信息 */
    GetTextActive = 16,
    /** 批量队列化处理 */
    TasksQueue = 17,
    /** 指针hover元素事件 */
    CursorHover = 18,
    /** 丢失焦点事件 */
    CursorBlur = 19,
    /** 前端日志 */
    Console = 20
}
export declare enum ECanvasContextType {
    Webgl2 = "webgl2",
    Webgl = "webgl",
    Canvas2d = "2d"
}
export declare enum ECanvasShowType {
    None = 0,
    /** 背景画布 */
    Bg = 1,
    /** 服务端前置画布 */
    ServiceFloat = 2,
    /** 本地前置画布 */
    Float = 3,
    /** 绝对最顶层 */
    TopFloat = 4
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
    both = 3,
    /** 等比例 */
    proportional = 4
}
export declare enum EvevtWorkType {
    Pending = 0,
    Start = 1,
    Doing = 2,
    Done = 3,
    /** 只读状态 */
    Unwritable = 4
}
export declare enum EMatrixrRelationType {
    inside = 0,
    outside = 1,
    intersect = 2
}
