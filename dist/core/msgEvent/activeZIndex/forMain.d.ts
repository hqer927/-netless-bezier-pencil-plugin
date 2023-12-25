import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
export type ZIndexActiveEmtData = {
    workId: IworkId;
    isActive: boolean;
};
export declare class ZIndexActiveMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: ZIndexActiveEmtData): void;
}
