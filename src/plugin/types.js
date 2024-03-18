export var DisplayStateEnum;
(function (DisplayStateEnum) {
    DisplayStateEnum[DisplayStateEnum["pedding"] = 0] = "pedding";
    DisplayStateEnum[DisplayStateEnum["mounted"] = 1] = "mounted";
    DisplayStateEnum[DisplayStateEnum["update"] = 2] = "update";
    DisplayStateEnum[DisplayStateEnum["unmounted"] = 3] = "unmounted";
})(DisplayStateEnum || (DisplayStateEnum = {}));
export var EStrokeType;
(function (EStrokeType) {
    EStrokeType[EStrokeType["Normal"] = 0] = "Normal";
    EStrokeType[EStrokeType["Stroke"] = 1] = "Stroke";
    EStrokeType[EStrokeType["Dotted"] = 2] = "Dotted";
    EStrokeType[EStrokeType["LongDotted"] = 3] = "LongDotted";
})(EStrokeType || (EStrokeType = {}));
export var EmitEventType;
(function (EmitEventType) {
    /** 显示悬浮栏 */
    EmitEventType["ShowFloatBar"] = "ShowFloatBar";
    /** 设置悬浮栏层级 */
    EmitEventType["ZIndexFloatBar"] = "ZIndexFloatBar";
    /** 删除节点 */
    EmitEventType["DeleteNode"] = "DeleteNode";
    /** 复制节点 */
    EmitEventType["CopyNode"] = "CopyNode";
    /** 激活层级设置 */
    EmitEventType["ZIndexActive"] = "ZIndexActive";
    /** 设置节点层级 */
    EmitEventType["ZIndexNode"] = "ZIndexNode";
    /** 旋转节点 */
    EmitEventType["RotateNode"] = "RotateNode";
    /** 设置节点颜色 */
    EmitEventType["SetColorNode"] = "SetColorNode";
    /** 移动节点 */
    EmitEventType["TranslateNode"] = "TranslateNode";
    /** 拉伸节点 */
    EmitEventType["ScaleNode"] = "ScaleNode";
    /** 原始事件 */
    EmitEventType["OriginalEvent"] = "OriginalEvent";
    /** 创建canvas */
    EmitEventType["CreateScene"] = "createScene";
    /** 激活cursor */
    EmitEventType["ActiveCursor"] = "ActiveCursor";
    /** 移动cursor */
    EmitEventType["MoveCursor"] = "MoveCursor";
})(EmitEventType || (EmitEventType = {}));
export var InternalMsgEmitterType;
(function (InternalMsgEmitterType) {
    InternalMsgEmitterType["DisplayState"] = "DisplayState";
    InternalMsgEmitterType["FloatBar"] = "FloatBar";
    InternalMsgEmitterType["CanvasSelector"] = "CanvasSelector";
    InternalMsgEmitterType["MainEngine"] = "MainEngine";
    InternalMsgEmitterType["DisplayContainer"] = "DisplayContainer";
    InternalMsgEmitterType["Cursor"] = "Cursor";
})(InternalMsgEmitterType || (InternalMsgEmitterType = {}));
