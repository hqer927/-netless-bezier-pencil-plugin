import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
export type CopyNodeEmtData = {
    workIds: IworkId[];
};
export declare class CopyNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: CopyNodeEmtData): void;
}
