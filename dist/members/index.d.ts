import { RoomMember } from "../plugin/types";
export type MemberDiff = {
    online: string[];
    offline: string[];
};
export declare class RoomMemberManager {
    private roomMembers;
    private onChangeHooks;
    setRoomMembers(roomMembers: readonly RoomMember[]): void;
    private executChangeUidHook;
    getRoomMember(uid: string): RoomMember | undefined;
    isOnLine(uid: string): boolean;
    onUidChangeHook(callBack: (diff: MemberDiff) => void): void;
    destroy(): void;
}
