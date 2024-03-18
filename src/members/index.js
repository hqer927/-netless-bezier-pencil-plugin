export class RoomMemberManager {
    constructor() {
        Object.defineProperty(this, "roomMembers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "onChangeHooks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
    }
    setRoomMembers(roomMembers) {
        this.executChangeUidHook(this.roomMembers, roomMembers);
        this.roomMembers = roomMembers;
    }
    executChangeUidHook(_old, _new) {
        const diff = {
            online: _new.map(m => m.payload?.uid || m.session),
            offline: _old.map(m => m.payload?.uid || m.session)
        };
        this.onChangeHooks.forEach((cb) => cb(diff));
    }
    getRoomMember(uid) {
        return this.roomMembers.find((r) => r.payload?.uid === uid);
    }
    isOnLine(uid) {
        return !this.getRoomMember(uid);
    }
    onUidChangeHook(callBack) {
        this.onChangeHooks.add(callBack);
    }
    destroy() {
        this.onChangeHooks.clear();
    }
}
