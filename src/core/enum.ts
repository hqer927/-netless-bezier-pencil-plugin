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
 * 本地数据: Init、Transform、UpdateTools、CombineDraw
 * 服务端数据: 
 */
export enum EPostMessageType {
    /** 初始化,仅用于本地 */
    Init,
    /** 本地动画,仅用于本地 */
    Transform,
    /** 更新tool配置数据,仅用于本地 */
    UpdateTools,
    /** 更新offScene配置数据 */
    UpdateScene,
    /** 创建一次work */
    CreateWork,
    /** 绘制当次work（高频） */
    DrawWork,
    /** 完成完整的一次work */
    FullWork,
    /** 更新work配置数据 */
    UpdateWork,
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
    /** 合并绘制 */
    CombineDraw
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
export enum EanimationMode {
    immediately = 'immediately',
    continuous = 'continuous'
}
export enum ECanvasShowType {
    Float,
    Bg
}