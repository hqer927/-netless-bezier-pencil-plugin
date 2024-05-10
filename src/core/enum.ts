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
export enum EvevtWorkState{
    Pending,
    Start,
    Doing,
    Done,
    Freeze,
    Unwritable
}
/**
 * 消息变化顺序: init => Scene事件 => work事件 => node事件
 * 本地数据: Init、Transform、UpdateTools
 * 服务端数据:
 */
export enum EPostMessageType {
    /** 什么也不需要做 */
    None,
    /** 初始化,仅用于本地 */
    Init,
    /** 本地视口切换,仅用于本地 */
    UpdateCamera,
    /** 更新tool配置数据,仅用于本地 */
    UpdateTools,
    /** 创建一次work */
    CreateWork,
    /** 绘制当次work（高频） */
    DrawWork,
    /** 完成完整的一次work */
    FullWork,
    /** 更新已有node */
    UpdateNode,
    /** 删除node */
    RemoveNode,
    /** 清空 */
    Clear,
    /** 选中 */
    Select,
    /** 销毁 */
    Destroy,
    /** 获取指定场景快照 */
    Snapshot,
    /** 获取指定场所有元素的的包围盒 */
    BoundingBox,
    /** 指针事件 */
    Cursor,
    /** 更新文本 */
    TextUpdate,
    /** 获取获奖的文本信息 */
    GetTextActive,
    /** 批量队列化处理 */
    TasksQueue,
    /** 指针hover元素事件 */
    CursorHover
}
export enum ECanvasContextType {
    Webgl2 = 'webgl2',
    Webgl = 'webgl',
    Canvas2d = '2d',
}
export enum ECanvasShowType {
    Float = 1,
    Bg,
    Selector,
    None
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