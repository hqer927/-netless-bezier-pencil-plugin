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
    Snapshot = 12
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
    Selector = 3,
    None = 4
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
