/** 同步事件类型 */
export enum EEventDataKey {
    GetPoint = 'getPoint',
    // Remove = 'remove',
    // Clear = 'clear',
}
/** 同步类型 */
export enum SyncedType {
    State,
    Event
}

export enum EThreadType {
    Main,
    Worker,
}