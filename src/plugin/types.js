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
export var EInternalEventType;
(function (EInternalEventType) {
    /** 显示悬浮栏 */
    EInternalEventType["ShowFloatBar"] = "ShowFloatBar";
    /** 隐藏悬浮栏 */
    EInternalEventType["HidFloatBar"] = "HidFloatBar";
    /** 显示悬浮栏按钮组 */
    EInternalEventType["ShowFloatBtns"] = "ShowFloatBtns";
    /** 显示悬浮栏按钮组 */
    EInternalEventType["HidFloatBtns"] = "HidFloatBtns";
    /** 删除节点 */
    EInternalEventType["DeleteNode"] = "DeleteNode";
    /** 复制节点 */
    EInternalEventType["CopyNode"] = "CopyNode";
    /** 设置节点层级 */
    EInternalEventType["ZIndexNode"] = "ZIndexNode";
    /** 旋转节点 */
    EInternalEventType["RotateNode"] = "RotateNode";
    /** 设置节点颜色 */
    EInternalEventType["SetColorNode"] = "SetColorNode";
    /** 移动节点 */
    EInternalEventType["TranslateNode"] = "TranslateNode";
    /** 拉伸节点 */
    EInternalEventType["ScaleNode"] = "ScaleNode";
})(EInternalEventType || (EInternalEventType = {}));
