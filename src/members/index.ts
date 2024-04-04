import { RoomMember } from "white-web-sdk";

export type MemberDiff = {
    online: string[];
    offline: string[];
}

export class RoomMemberManager  {
    private roomMembers:readonly RoomMember[] = [];
    private onChangeHooks: Set<(diff:MemberDiff)=>void> = new Set();
    setRoomMembers(roomMembers:readonly RoomMember[]){
        this.executChangeUidHook(this.roomMembers, roomMembers);
        this.roomMembers = roomMembers;
    }
    private executChangeUidHook(_old:readonly RoomMember[], _new:readonly RoomMember[]){
        const diff = {
            online: _new.map(m=>m.payload?.uid || m.session),
            offline: _old.map(m=>m.payload?.uid || m.session)
        }
        this.onChangeHooks.forEach((cb)=>cb(diff));
    }
    getRoomMember(uid:string): RoomMember | undefined{
        return this.roomMembers.find((r:RoomMember)=>r.payload?.uid === uid)
    }
    isOnLine(uid:string){
        return !this.getRoomMember(uid);
    }
    onUidChangeHook(callBack:(diff:MemberDiff)=>void){
        this.onChangeHooks.add(callBack);
    }
    destroy(){
        this.onChangeHooks.clear();
    }
}