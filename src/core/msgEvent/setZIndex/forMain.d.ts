import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
export type ZIndexNodeEmtData = {
    workIds: IworkId[];
    num: number;
};
export declare class ZIndexNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: ZIndexNodeEmtData): void;
}
