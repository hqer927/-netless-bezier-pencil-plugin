import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
export type ZIndexActiveEmtData = {
    workId: IworkId;
    isActive: boolean;
    viewId: string;
};
export declare class ZIndexActiveMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: ZIndexActiveEmtData): void;
}
