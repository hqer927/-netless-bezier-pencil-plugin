import { EmitEventType } from "../../../plugin/types";
import { BaseMsgMethod } from "../base";
import { IworkId } from "../../types";
import { EvevtWorkState } from "../../enum";
export type SetColorNodeEmtData = {
    workIds: IworkId[];
    color: string;
    opacity?: number;
    workState?: EvevtWorkState;
};
export declare class SetColorNodeMethod extends BaseMsgMethod {
    readonly emitEventType: EmitEventType;
    collect(data: SetColorNodeEmtData): void;
}
