export declare enum EToolsKey {
    Pencil = 1,
    Eraser = 2,
    Selector = 3,
    Clicker = 4,
    Arrow = 5,
    Hand = 6,
    LaserPen = 7
}
export declare enum ESpriteNodeKey {
    Path = 0,
    Rect = 1
}
export declare enum EDataType {
    /** 本地数据 */
    Local = 1,
    /** 服务端数据 */
    Service = 2
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
 * 本地数据: Init、Transform、UpdateTools、CombineDraw
 * 服务端数据:
 */
export declare enum EPostMessageType {
    /** 初始化,仅用于本地 */
    Init = 0,
    /** 本地视口切换,仅用于本地 */
    UpdateCamera = 1,
    /** 更新tool配置数据,仅用于本地 */
    UpdateTools = 2,
    /** 更新offScene配置数据 */
    UpdateScene = 3,
    /** 创建一次work */
    CreateWork = 4,
    /** 绘制当次work（高频） */
    DrawWork = 5,
    /** 完成完整的一次work */
    FullWork = 6,
    /** 更新work配置数据 */
    UpdateWork = 7,
    /** 更新已有node */
    UpdateNode = 8,
    /** 删除node */
    RemoveNode = 9,
    /** 清空 */
    Clear = 10,
    /** 选中 */
    Select = 11,
    /** 销毁 */
    Destroy = 12,
    /** 什么也不需要做 */
    None = 13,
    /** 合并绘制 */
    CombineDraw = 14
}
export declare enum EShapeDataTypeKey {
    Path = 0,
    Rect = 1,
    Texture = 2
}
export declare enum ECanvasContextType {
    Webgl2 = "webgl2",
    Webgl = "webgl",
    Canvas2d = "2d"
}
export declare enum ECanvasShowType {
    Float = 1,
    Bg = 2,
    Selector = 3
}
export declare enum EScaleDirection {
    LT = "topLeft",
    LC = "left",
    LB = "bottomLeft",
    TC = "top",
    RT = "topRight",
    RC = "right",
    RB = "bottomRight",
    BC = "bottom"
}
