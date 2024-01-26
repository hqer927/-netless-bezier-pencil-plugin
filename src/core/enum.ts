export enum EToolsKey{
    Pencil = 1,
    Eraser,
    Selector,
    Clicker,
    Arrow,
    Hand,
    LaserPen
}
export enum ESpriteNodeKey{
    Path,
    Rect
}
export enum EDataType{
    /** 本地数据 */
    Local = 1,
    /** 服务端数据 */
    Service
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
    /** 什么也不需要做 */
    None,
    /** 获取指定场景快照 */
    Snapshot
}
export enum EShapeDataTypeKey{
    Path,
    Rect,
    Texture,
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
export enum EScaleDirection {
    LT = 'topLeft',
    LC = 'left',
    LB = 'bottomLeft',
    TC = 'top',
    RT = 'topRight',
    RC = 'right',
    RB = 'bottomRight',
    BC = 'bottom'
}

