/** 同步事件类型 */
export var EEventDataKey;
(function (EEventDataKey) {
    EEventDataKey["GetPoint"] = "getPoint";
    // Remove = 'remove',
    // Clear = 'clear',
})(EEventDataKey || (EEventDataKey = {}));
/** 同步类型 */
export var SyncedType;
(function (SyncedType) {
    SyncedType[SyncedType["State"] = 0] = "State";
    SyncedType[SyncedType["Event"] = 1] = "Event";
})(SyncedType || (SyncedType = {}));
export var EThreadType;
(function (EThreadType) {
    EThreadType[EThreadType["Main"] = 0] = "Main";
    EThreadType[EThreadType["Worker"] = 1] = "Worker";
})(EThreadType || (EThreadType = {}));
