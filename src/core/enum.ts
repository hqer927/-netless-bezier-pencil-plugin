export enum EToolsKey{
    /** 铅笔绘制工具 */
    Pencil = 1,
    /** 橡皮擦工具 */
    Eraser,
    /** 选择工具 */
    Selector,
    /** 点击互动工具 */
    Clicker,
    /** 箭头工具 */
    Arrow,
    /** 抓手工具 */
    Hand,
    /** 激光铅笔绘制工具 */
    LaserPen,
    /** 文字工具 */
    Text,
    /** 直线工具 */
    Straight,
    /** 矩形工具 */
    Rectangle,
    /** 圆形工具 */
    Ellipse,
    /** 星形工具 */
    Star,
    /** 三角形工具 */
    Triangle,
    /** 菱形工具 */
    Rhombus,
    /** 多边形工具 */
    Polygon,
    /** 聊天泡泡框 */
    SpeechBalloon,
    /** 图片 */
    Image
}
export enum EDataType{
    /** 本地数据 */
    Local = 1,
    /** 服务端数据 */
    Service,
    /** 来源于worker */
    Worker
}
export enum EvevtWorkState {
    Pending,
    Start,
    Doing,
    Done,
    /** 只读状态 */
    Unwritable
}
/**
 * 事件消息类型
 */
export enum EPostMessageType {
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
    Console = 20,
}
export enum ECanvasContextType {
    Webgl2 = 'webgl2',
    Webgl = 'webgl',
    Canvas2d = '2d',
}
export enum ECanvasShowType {
    None = 0,
    /** 背景画布 */
    Bg,
    /** 服务端前置画布 */
    ServiceFloat,
    /** 本地前置画布 */
    Float,
    /** 绝对最顶层 */
    TopFloat,
}

export enum EventMessageType {
    /** cursor事件 */
    Cursor = 1,
    /** 创建text编辑器 */
    TextCreate,
}

export enum ElayerType {
    Top = 1,
    Bottom
}

export enum EScaleType {
    /** 不可以拉伸 */
    none = 1,
    /** 八个方向都可以拉伸 */
    all,
    /** 两个方向拉伸 */
    both,
    /** 等比例 */
    proportional
}

export enum EvevtWorkType {
    Pending,
    Start,
    Doing,
    Done,
    /** 只读状态 */
    Unwritable
}

export enum EMatrixrRelationType {
    inside,
    outside,
    intersect
}